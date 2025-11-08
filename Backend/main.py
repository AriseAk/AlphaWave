import os
import time
import threading
import requests
import json
from datetime import datetime, timedelta
from functools import wraps
from urllib import parse as urllib_parse
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import jwt
from authlib.integrations.flask_client import OAuth

load_dotenv()

# ---- Environment & Config ----

MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("SECRET_KEY", "dev_jwt_secret")
JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", 86400))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

FINNHUB_KEY = os.getenv("FINNHUB_KEY")
REFRESH_INTERVAL = int(os.getenv("REFRESH_INTERVAL", 60))
PORT = int(os.getenv("PORT", 5000))

TRACKED_SYMBOLS = [
    s.strip().upper()
    for s in os.getenv("TRACKED_SYMBOLS", "RELIANCE.NS,TCS.NS,INFY.NS,HDFCBANK.NS,ICICIBANK.NS").split(",")
    if s.strip()
]

if not MONGODB_URI or not FINNHUB_KEY :
    raise RuntimeError("Please set one of MONGODB_URI and FINNHUB_KEY in your .env")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_ORIGIN]}})
app.secret_key = JWT_SECRET

# ---- MongoDB Clients and Collections ----

# For user info and auth, use MONGODB_URI
client = MongoClient(MONGODB_URI, tls=True, tlsAllowInvalidCertificates=False)
db = client['userinfo']
users_col = db['users']
leaderboard_col = db['leaderboard']
challenges_col = db['challenges']

client_quotes = MongoClient(MONGODB_URI)
db_quotes = client_quotes["alphawave"]
quotes_col = db_quotes["quotes"]
search_cache_col = db_quotes["searches"]

quotes_col.create_index([("symbol", ASCENDING)], unique=True)
search_cache_col.create_index([("query", ASCENDING)], unique=True)

# ---- OAuth Setup ----

oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

try:
    app.logger.info("Loaded Google server_metadata keys: %s", list(google.server_metadata.keys()))
    app.logger.info("Google userinfo_endpoint: %s", google.server_metadata.get("userinfo_endpoint"))
except Exception:
    app.logger.exception("Unable to read google.server_metadata (discovery may have failed)")

# ---- Helper Functions ----

def require_json(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "JSON body required"}), 400
        return f(*args, **kwargs)
    return wrapper

def now_ts():
    return int(time.time())

def iso_now():
    return datetime.utcnow().isoformat() + "Z"

def fetch_quote_from_finnhub(symbol):
    url = "https://finnhub.io/api/v1/quote"
    try:
        r = requests.get(url, params={"symbol": symbol, "token": FINNHUB_KEY}, timeout=6)
        r.raise_for_status()
        data = r.json()
        if not data or ("c" not in data) or data.get("c") in (None, 0):
            return None
        return {
            "symbol": symbol,
            "price": float(data.get("c", 0.0)),
            "high": float(data.get("h", 0.0)),
            "low": float(data.get("l", 0.0)),
            "open": float(data.get("o", 0.0)),
            "prev_close": float(data.get("pc", 0.0)),
            "timestamp": now_ts(),
            "last_updated": iso_now()
        }
    except Exception:
        return None

def get_cached_quote(symbol, max_age_seconds=60):
    doc = quotes_col.find_one({"symbol": symbol.upper()})
    if not doc:
        return None
    age = now_ts() - int(doc.get("timestamp", 0))
    if age > max_age_seconds:
        return None
    doc.pop("_id", None)
    return doc

def upsert_quote(doc):
    if not doc:
        return
    quotes_col.update_one({"symbol": doc["symbol"]}, {"$set": doc}, upsert=True)

SEARCH_TTL_SECONDS = int(os.getenv("SEARCH_TTL_SECONDS", 86400))

def fetch_search_from_finnhub(q):
    url = "https://finnhub.io/api/v1/search"
    try:
        r = requests.get(url, params={"q": q, "token": FINNHUB_KEY}, timeout=6)
        r.raise_for_status()
        data = r.json()
        results = data.get("result", []) if isinstance(data, dict) else []
        normalized = []
        for it in results:
            normalized.append({
                "symbol": it.get("symbol") or it.get("displaySymbol"),
                "displaySymbol": it.get("displaySymbol") or it.get("symbol"),
                "description": it.get("description"),
                "type": it.get("type"),
                "exchange": (it.get("symbol") or "").split(".")[-1] if it.get("symbol") and "." in it.get("symbol") else None
            })
        return normalized
    except Exception:
        return []

def get_cached_search(q):
    qnorm = q.strip().lower()
    doc = search_cache_col.find_one({"query": qnorm})
    if not doc:
        return None
    age = now_ts() - int(doc.get("fetched_at", 0))
    if age > SEARCH_TTL_SECONDS:
        return None
    doc.pop("_id", None)
    return doc.get("results", [])

def upsert_search(q, results):
    qnorm = q.strip().lower()
    search_cache_col.update_one(
        {"query": qnorm},
        {"$set": {"query": qnorm, "results": results, "fetched_at": now_ts(), "last_updated": iso_now()}},
        upsert=True
    )

def refresh_tracked_loop():
    while True:
        start = now_ts()
        if not TRACKED_SYMBOLS:
            time.sleep(REFRESH_INTERVAL)
            continue
        for sym in TRACKED_SYMBOLS:
            doc = fetch_quote_from_finnhub(sym)
            if doc:
                upsert_quote(doc)
        elapsed = now_ts() - start
        sleep_for = max(1, REFRESH_INTERVAL - elapsed)
        time.sleep(sleep_for)

# ---- Auth & User Functions ----

def create_default_user(user_id: str) -> dict:
    now = datetime.utcnow()
    user_doc = {
        "user_id": user_id,
        "balance": 100000.0,
        "portfolio": [],
        "tradeHistory": [],
        "badges": [],
        "quizProgress": {},
        "tokens": 0,
        "created_at": now,
        "updated_at": now
    }
    users_col.insert_one(user_doc)
    return user_doc

def get_user(user_id: str) -> dict:
    user = users_col.find_one({"user_id": user_id})
    if not user:
        user = create_default_user(user_id)
    return user

def update_user(user_id: str, update_dict: dict) -> None:
    update_dict["updated_at"] = datetime.utcnow()
    users_col.update_one({"user_id": user_id}, {"$set": update_dict})

def create_jwt_for_user(user_doc: dict) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": str(user_doc.get("user_id", user_doc.get("username"))),
        "email": user_doc.get("email"),
        "name": user_doc.get("name"),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=JWT_EXP_SECONDS)).timestamp()),
        "provider": user_doc.get("provider", "oauth")
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def upsert_oauth_user(email: str, name: str = None, provider: str = "google", extra: dict = None) -> dict:
    query = {"email": email}
    now = datetime.utcnow()
    update = {
        "$set": {
            "username": name,
            "email": email,
            "name": name,
            "provider": provider,
            "updated_at": now
        },
        "$setOnInsert": {
            "created_at": now,
            "balance": 100000.0,
            "portfolio": [],
            "tradeHistory": []
        }
    }
    users_col.update_one(query, update, upsert=True)
    user = users_col.find_one(query)
    if user:
        user["user_id"] = user.get("username")
        user.pop("_id", None)
    return user

# ---- Routes ----

@app.route("/auth/google", methods=["GET"])
def auth_google():
    redirect_uri = url_for("auth_google_callback", _external=True)
    app.logger.info("auth_google redirect_uri: %s", redirect_uri)
    return google.authorize_redirect(redirect_uri)

@app.route("/auth/google/callback", methods=["GET"])
def auth_google_callback():
    token = google.authorize_access_token()
    userinfo = google.get("https://www.googleapis.com/oauth2/v2/userinfo").json()
    email = userinfo.get("email")
    name = userinfo.get("name") or userinfo.get("given_name") or (email.split("@")[0] if email else None)
    if not email:
        return jsonify({"error": "No email returned"}), 400
    user = upsert_oauth_user(email=email, name=name, provider="google")
    jwt_token = create_jwt_for_user(user)
    redirect_url = FRONTEND_ORIGIN.rstrip("/") + "/invest?token=" + urllib_parse.quote(jwt_token)
    return redirect(redirect_url)

@app.route("/api/portfolio/<user_id>", methods=["GET"])
def get_portfolio(user_id):
    user = get_user(user_id)
    user.pop("_id", None)
    return jsonify(user)

@app.route("/api/portfolio/<user_id>/trade", methods=["POST"])
@require_json
def portfolio_trade(user_id):
    payload = request.json
    action = payload.get("action")
    symbol = payload.get("symbol")
    qty = int(payload.get("qty", 0))
    price = float(payload.get("price", 0.0))
    if action not in ("buy", "sell") or not symbol or qty <= 0 or price <= 0:
        return jsonify({"error": "invalid trade payload"}), 400

    user = get_user(user_id)
    balance = user.get("balance", 0.0)
    portfolio = user.get("portfolio", [])
    trade_record = {
        "action": action,
        "symbol": symbol.upper(),
        "qty": qty,
        "price": price,
        "timestamp": datetime.utcnow()
    }

    if action == "buy":
        cost = qty * price
        if balance < cost:
            return jsonify({"error": "insufficient balance"}), 400
        balance -= cost
        found = False
        for h in portfolio:
            if h["symbol"] == symbol.upper():
                existing_qty = h["qty"]
                existing_avg = h["avgPrice"]
                new_qty = existing_qty + qty
                new_avg = (existing_avg * existing_qty + price * qty) / new_qty
                h["qty"] = new_qty
                h["avgPrice"] = round(new_avg, 4)
                found = True
                break
        if not found:
            portfolio.append({"symbol": symbol.upper(), "qty": qty, "avgPrice": round(price, 4)})
    else:  # sell
        for h in portfolio:
            if h["symbol"] == symbol.upper():
                if h["qty"] < qty:
                    return jsonify({"error": "not enough shares to sell"}), 400
                h["qty"] -= qty
                balance += qty * price
                if h["qty"] == 0:
                    portfolio = [x for x in portfolio if not (x["symbol"] == symbol.upper() and x["qty"] == 0)]
                break
        else:
            return jsonify({"error": "holding not found"}), 400

    trade_record["resulting_balance"] = round(balance, 4)
    users_col.update_one({"user_id": user_id}, {"$set": {"balance": balance, "portfolio": portfolio}, "$push": {"tradeHistory": trade_record}}, upsert=True)
    updated_user = get_user(user_id)
    updated_user.pop("_id", None)
    return jsonify(updated_user)

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    docs = leaderboard_col.find().sort("balance", -1).limit(20)
    out = []
    for d in docs:
        d.pop("_id", None)
        out.append(d)
    return jsonify(out)

@app.route("/api/leaderboard/update", methods=["POST"])
@require_json
def update_leaderboard():
    payload = request.json
    user_id = payload.get("user_id")
    balance = float(payload.get("balance", 0.0))
    display_name = payload.get("display_name", user_id)
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    leaderboard_col.update_one({"user_id": user_id}, {"$set": {"balance": balance, "display_name": display_name, "updated_at": datetime.utcnow()}}, upsert=True)
    return jsonify({"status": "ok"})

@app.route("/api/challenge/complete", methods=["POST"])
@require_json
def complete_challenge():
    payload = request.json
    user_id = payload.get("user_id")
    challenge_id = payload.get("challenge_id")
    reward = int(payload.get("reward_tokens", 0))
    if not user_id or not challenge_id:
        return jsonify({"error": "missing fields"}), 400
    users_col.update_one({"user_id": user_id}, {"$inc": {"tokens": reward}})
    challenges_col.insert_one({"user_id": user_id, "challenge_id": challenge_id, "reward": reward, "completed_at": datetime.utcnow()})
    return jsonify({"status": "ok", "awarded": reward})

@app.route("/api/user/reset/<user_id>", methods=["POST"])
def reset_user(user_id):
    users_col.delete_one({"user_id": user_id})
    return jsonify({"status": "ok", "message": f"user {user_id} removed (will be recreated on next access)"}), 200

# ---- Quote Tracking Endpoints ----

@app.route("/api/tracked", methods=["GET"])
def api_tracked():
    return jsonify({"tracked": TRACKED_SYMBOLS})

@app.route("/api/quote/<symbol>", methods=["GET"])
def api_quote(symbol):
    sym = symbol.strip().upper()
    cached = get_cached_quote(sym, max_age_seconds=REFRESH_INTERVAL)
    if cached:
        return jsonify(cached)
    doc = fetch_quote_from_finnhub(sym)
    if not doc:
        return jsonify({"error": "symbol not found or no data available"}), 404
    upsert_quote(doc)
    return jsonify(doc)

@app.route("/api/quotes", methods=["GET"])
def api_quotes():
    docs = list(quotes_col.find({}, {"_id": 0}))
    return jsonify({"count": len(docs), "data": docs})

@app.route("/api/search", methods=["GET"])
def api_search():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"error": "query param 'q' required"}), 400
    cached = get_cached_search(q)
    if cached is not None:
        return jsonify({"query": q, "cached": True, "results": cached})
    results = fetch_search_from_finnhub(q)
    upsert_search(q, results)
    return jsonify({"query": q, "cached": False, "results": results})

# ---- Model Endpoints (Placeholders) ----

@app.route("/api/sentiment", methods=["POST"])
@require_json
def sentiment():
    pass

@app.route("/api/predict", methods=["POST"])
@require_json
def predict():
    pass

@app.route("/api/risk-score", methods=["POST"])
@require_json
def risk_score():
    pass

if __name__ == "__main__":
    t = threading.Thread(target=refresh_tracked_loop, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=PORT, debug=True)
