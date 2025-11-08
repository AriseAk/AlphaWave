import os
import time
import json
import requests
from datetime import datetime, timedelta
from functools import wraps
from urllib import parse as urllib_parse
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import jwt
from authlib.integrations.flask_client import OAuth

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("SECRET_KEY", "dev_jwt_secret")
JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", 86400))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

if not MONGODB_URI:
    raise RuntimeError("Please set MONGODB_URI in your .env")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_ORIGIN]}})
app.secret_key = os.getenv("SECRET_KEY")  

# Enable TLS explicitly for MongoClient for Atlas connections
client = MongoClient(MONGODB_URI, tls=True, tlsAllowInvalidCertificates=False)
db = client['userinfo']
users_col = db['users']

oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# Debug: log server metadata keys and userinfo endpoint (helps diagnose discovery issues)
try:
    app.logger.info("Loaded Google server_metadata keys: %s", list(google.server_metadata.keys()))
    app.logger.info("Google userinfo_endpoint: %s", google.server_metadata.get("userinfo_endpoint"))
except Exception:
    app.logger.exception("Unable to read google.server_metadata (discovery may have failed)")

def require_json(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "JSON body required"}), 400
        return f(*args, **kwargs)
    return wrapper

def call_model(url, payload, timeout=5):
    if not url:
        return None
    try:
        resp = requests.post(url, json=payload, timeout=timeout)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        app.logger.warning(f"Model call to {url} failed: {e}")
        return None

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
    print('hello')
    # Use email as unique identifier for query and find
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

@app.route("/auth/google", methods=["GET"])
def auth_google():
    redirect_uri = url_for("auth_google_callback", _external=True)
    app.logger.info("auth_google redirect_uri: %s", redirect_uri)
    return google.authorize_redirect(redirect_uri)

@app.route("/auth/google/callback", methods=["GET"])
def auth_google_callback():
    token = google.authorize_access_token()
    userinfo = google.get("https://www.googleapis.com/oauth2/v2/userinfo").json()
    print(userinfo)
    email = userinfo.get("email")
    name = userinfo.get("name") or userinfo.get("given_name") or (email.split("@")[0] if email else None)
    if not email:
        return jsonify({"error": "No email returned"}), 400

    user = upsert_oauth_user(email=email, name=name, provider="google")
    jwt_token = create_jwt_for_user(user)
    redirect_url = FRONTEND_ORIGIN.rstrip("/") + "/invest?token=" + urllib_parse.quote(jwt_token)
    return redirect(redirect_url)

# -------------------------
# Model endpoints (proxy / mock)
# -------------------------
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

# -------------------------
# News endpoint (proxy)
# -------------------------
# @app.route("/api/news", methods=["GET"])
# def news():
#     """
#     Query params: symbol=<SYMBOL>
#     Uses NEWSAPI_KEY if provided, else returns demo news.
#     """
#     symbol = request.args.get("symbol", "")
#     if NEWSAPI_KEY:
#         try:
#             q = symbol or "stock market"
#             resp = requests.get(
#                 "https://newsapi.org/v2/everything",
#                 params={"q": q, "sortBy": "publishedAt", "language": "en", "pageSize": 5},
#                 headers={"Authorization": NEWSAPI_KEY},
#                 timeout=6
#             )
#             resp.raise_for_status()
#             data = resp.json().get("articles", [])
#             simplified = [
#                 {"title": a.get("title"), "url": a.get("url"), "source": a.get("source", {}).get("name"), "publishedAt": a.get("publishedAt")}
#                 for a in data
#             ]
#             return jsonify(simplified)
#         except Exception as e:
#             app.logger.warning(f"News API failed: {e}")
#     # demo fallback
#     now_ts = int(time.time())
#     demo = [
#         {"title": f"{symbol or 'Market'} demo news - earnings update", "url": "https://example.com/1", "source": "DemoNews", "publishedAt": now_ts},
#         {"title": f"Analyst updates on {symbol or 'market'}", "url": "https://example.com/2", "source": "DemoNews", "publishedAt": now_ts - 3600}
#     ]
#     return jsonify(demo)

# -------------------------
# Portfolio & Trade endpoints
# -------------------------
@app.route("/api/portfolio/<user_id>", methods=["GET"])
def get_portfolio(user_id):
    user = get_user(user_id)
    # Convert ObjectId and datetime types if present
    user.pop("_id", None)
    return jsonify(user)

@app.route("/api/portfolio/<user_id>/trade", methods=["POST"])
@require_json
def portfolio_trade(user_id):
    """
    Body:
      {
        "action": "buy" | "sell",
        "symbol": "AAPL",
        "qty": 1,
        "price": 150.0
      }
    """
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
        # update or append holding
        found = False
        for h in portfolio:
            if h["symbol"] == symbol.upper():
                # update avgPrice and qty
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
        # naive sell: remove qty from first matching holding
        for h in portfolio:
            if h["symbol"] == symbol.upper():
                if h["qty"] < qty:
                    return jsonify({"error": "not enough shares to sell"}), 400
                h["qty"] -= qty
                balance += qty * price
                # remove zero qty holdings
                if h["qty"] == 0:
                    portfolio = [x for x in portfolio if not (x["symbol"] == symbol.upper() and x["qty"] == 0)]
                break
        else:
            return jsonify({"error": "holding not found"}), 400

    # push trade to history and update user doc
    trade_record["resulting_balance"] = round(balance, 4)
    users_col.update_one({"user_id": user_id}, {"$set": {"balance": balance, "portfolio": portfolio}, "$push": {"tradeHistory": trade_record}}, upsert=True)
    updated_user = get_user(user_id)
    updated_user.pop("_id", None)
    return jsonify(updated_user)

# -------------------------
# Leaderboard / Challenges (simple)
# -------------------------
@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    # Return top users by balance (virtual)
    docs = leaderboard_col.find().sort("balance", -1).limit(20)
    out = []
    for d in docs:
        d.pop("_id", None)
        out.append(d)
    return jsonify(out)

@app.route("/api/leaderboard/update", methods=["POST"])
@require_json
def update_leaderboard():
    """
    Body: { "user_id": "...", "balance": 12345.67, "display_name": "Alice" }
    """
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
    """
    Body: { "user_id": "...", "challenge_id": "...", "reward_tokens": 100 }
    """
    payload = request.json
    user_id = payload.get("user_id")
    challenge_id = payload.get("challenge_id")
    reward = int(payload.get("reward_tokens", 0))
    if not user_id or not challenge_id:
        return jsonify({"error": "missing fields"}), 400
    users_col.update_one({"user_id": user_id}, {"$inc": {"tokens": reward}})
    # log challenge completion
    challenges_col.insert_one({"user_id": user_id, "challenge_id": challenge_id, "reward": reward, "completed_at": datetime.utcnow()})
    return jsonify({"status": "ok", "awarded": reward})

# -------------------------
# Backtesting endpoint (basic)
# -------------------------
# @app.route("/api/backtest", methods=["POST"])
# @require_json
# def backtest():
#     """
#     Body:
#       {
#         "symbol": "AAPL",
#         "start": "YYYY-MM-DD",
#         "end": "YYYY-MM-DD",
#         "strategy": {
#             "type": "buy_and_hold" | "sentiment_threshold",
#             // for sentiment_threshold: { "threshold": 0.2, "position_size_pct": 0.1 }
#         }
#       }
#     Returns simple P&L timeseries (mock or using yfinance)
#     """
#     payload = request.json
#     symbol = payload.get("symbol")
#     start = payload.get("start")
#     end = payload.get("end")
#     strategy = payload.get("strategy", {"type": "buy_and_hold"})

#     if not symbol or not start or not end:
#         return jsonify({"error": "symbol, start and end required"}), 400

#     if not YFINANCE_AVAILABLE:
#         return jsonify({"error": "yfinance not installed on the server; install yfinance for historical data"}), 500

#     try:
#         data = yf.download(symbol, start=start, end=end, progress=False)
#         if data.empty:
#             return jsonify({"error": "no historical data returned for symbol"}), 400
#         # Use close prices
#         closes = data["Close"]
#         result = []
#         if strategy.get("type") == "buy_and_hold":
#             entry_price = float(closes.iloc[0])
#             for dt, price in closes.items():
#                 pnl = (price - entry_price) / entry_price
#                 result.append({"date": str(dt.date()), "close": float(price), "pnl": round(pnl, 6)})
#             return jsonify({"symbol": symbol, "strategy": "buy_and_hold", "timeseries": result})
#         elif strategy.get("type") == "sentiment_threshold":
#             # Simple simulation: if mock sentiment > threshold => buy day after close, hold 1 day
#             threshold = float(strategy.get("threshold", 0.2))
#             position_size_pct = float(strategy.get("position_size_pct", 0.1))
#             # We'll use deterministic mock sentiment per day: based on date hash for demo
#             entry_price = None
#             position = 0.0
#             cash = 100000.0
#             history = []
#             for idx, (dt, price) in enumerate(closes.items()):
#                 # mock sentiment [-1,1]
#                 s = ((hash(str(dt.date())) % 21) - 10) / 10.0
#                 if s > threshold and cash > 0:
#                     # buy with position_size_pct of cash
#                     buy_amount = cash * position_size_pct
#                     position = buy_amount / price
#                     cash -= buy_amount
#                     entry_price = price
#                 # daily mark-to-market
#                 total_value = cash + position * price
#                 history.append({"date": str(dt.date()), "close": float(price), "cash": round(cash, 2), "position": round(position, 6), "total": round(total_value, 2), "mock_sentiment": round(s, 2)})
#             return jsonify({"symbol": symbol, "strategy": "sentiment_threshold", "timeseries": history})
#         else:
#             return jsonify({"error": "unknown strategy type"}), 400
#     except Exception as e:
#         app.logger.exception("Backtest failed")
#         return jsonify({"error": str(e)}), 500

# -------------------------
# Utility: reset user data (dev)
# -------------------------
@app.route("/api/user/reset/<user_id>", methods=["POST"])
def reset_user(user_id):
    users_col.delete_one({"user_id": user_id})
    return jsonify({"status": "ok", "message": f"user {user_id} removed (will be recreated on next access)"}), 200

# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
