import os
import io
import zipfile
import requests
import time
import re
from datetime import datetime
from collections import defaultdict
from flask import Flask, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GDELT_DATES = os.getenv("GDELT_DATES", "")  # comma separated YYYYMMDD e.g. "20251105,20251106"
# Example single-date default: today in YYYYMMDD if not provided (useful in prod)
if not GDELT_DATES:
    GDELT_DATES = datetime.utcnow().strftime("%Y%m%d")

if not MONGODB_URI:
    raise RuntimeError("Please set MONGODB_URI in your .env")

client = MongoClient(MONGODB_URI)
db = client.get_default_database()
mapcoll = db.get_collection("gdelt_map_aggregates")

SUSPICIOUS_KEYWORDS = {
    "pump", "dump", "insider", "scam", "manipulate", "fraud", "fake",
    "shill", "hoax", "rumor", "alleged", "conspiracy", "exploit", "ponzi"
}

GDELT_BASE = "http://data.gdeltproject.org/gdeltv2/"

COUNTRY_NAME_TO_CODE = {
    # Common names -> ISO2 code lowercase; add more as needed
    "united states": "us", "usa": "us", "america": "us",
    "india": "in", "china": "cn", "united kingdom": "gb", "uk": "gb",
    "russia": "ru", "germany": "de", "france": "fr", "canada": "ca",
    "australia": "au", "brazil": "br", "japan": "jp", "south korea": "kr",
    "south africa": "za", "spain": "es", "italy": "it", "netherlands": "nl",
    "switzerland": "ch", "sweden": "se", "mexico": "mx", "singapore": "sg",
    "hong kong": "hk"
}

# compile regex to find CountryCode=XX patterns in GDELT fields
COUNTRY_CODE_RE = re.compile(r"CountryCode=([A-Z]{2})")
# fallback regex to find country names in line text (word boundaries)
COUNTRY_WORD_RE = re.compile(r"\b(" + "|".join(re.escape(k) for k in COUNTRY_NAME_TO_CODE.keys()) + r")\b", re.IGNORECASE)

def download_gdelt_gkg_zip(date_yyyymmdd):
    filename = f"{date_yyyymmdd}.gkg.csv.zip"
    url = GDELT_BASE + filename
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return io.BytesIO(resp.content)

def parse_gkg_zip(zip_bytes_io):
    z = zipfile.ZipFile(zip_bytes_io)
    # GKG zip typically contains one .gkg.csv file. Read the first CSV file inside.
    csv_name = next((n for n in z.namelist() if n.lower().endswith(".gkg.csv")), None)
    if csv_name is None:
        return []
    with z.open(csv_name, "r") as fh:
        # read line by line as text
        for raw in fh:
            try:
                line = raw.decode("utf-8", errors="ignore").strip()
            except Exception:
                continue
            if not line:
                continue
            yield line

def extract_countries_from_line(line):
    # First, try to find CountryCode=XX
    codes = set()
    for m in COUNTRY_CODE_RE.finditer(line):
        codes.add(m.group(1).lower())
    if codes:
        return list(codes)

    # Fallback: match common country name words mapped above
    for m in COUNTRY_WORD_RE.finditer(line):
        name = m.group(1).lower()
        code = COUNTRY_NAME_TO_CODE.get(name)
        if code:
            return [code]

    # last resort: unknown
    return ["unknown"]

def score_line_for_suspicion(line):
    line_l = line.lower()
    score = 0.0
    for kw in SUSPICIOUS_KEYWORDS:
        if kw in line_l:
            score += 1.0
    # all caps headline heuristic (presence of long uppercase fragments)
    uppercase_fragments = re.findall(r"\b[A-Z]{3,}\b", line)
    if uppercase_fragments and len(" ".join(uppercase_fragments)) > 10:
        score += 0.8
    # exclamation mark / sensational punctuation
    if "!" in line and len(line) < 200:
        score += 0.5
    return round(score, 4)

def run_gdelt_etl(dates_csv):
    date_list = [d.strip() for d in dates_csv.split(",") if d.strip()]
    agg_counts = defaultdict(int)
    agg_scores = defaultdict(float)
    checked = 0

    for date in date_list:
        try:
            zip_io = download_gdelt_gkg_zip(date)
        except Exception as e:
            print(f"Failed to download GDELT file for {date}: {e}")
            continue

        for line in parse_gkg_zip(zip_io):
            checked += 1
            countries = extract_countries_from_line(line)  # list
            score = score_line_for_suspicion(line)
            if score <= 0:
                continue
            for c in countries:
                agg_counts[c] += 1
                agg_scores[c] += score

    # compute aggregates list
    now = datetime.utcnow()
    results = []
    for c, cnt in agg_counts.items():
        total = round(float(agg_scores[c]), 4)
        avg = round(total / cnt, 4) if cnt else 0.0
        results.append({
            "country": c,
            "suspiciousCount": int(cnt),
            "totalScore": total,
            "avgScore": avg,
            "lastUpdated": now
        })
    # upsert into MongoDB collection (one document per country)
    for r in results:
        key = {"country": r["country"]}
        doc = {
            "country": r["country"],
            "suspiciousCount": r["suspiciousCount"],
            "totalScore": r["totalScore"],
            "avgScore": r["avgScore"],
            "lastUpdated": r["lastUpdated"]
        }
        mapcoll.update_one(key, {"$set": doc}, upsert=True)

    return {"checked": checked, "countries": len(results), "generated_at": now.isoformat()}

# Flask API to serve cached aggregates
app = Flask(__name__)

@app.route("/api/mapDataCached", methods=["GET"])
def map_data_cached():
    docs = list(mapcoll.find({}, {"_id": 0, "country": 1, "suspiciousCount": 1, "totalScore": 1, "avgScore": 1, "lastUpdated": 1}))
    # sort by totalScore desc
    docs = sorted(docs, key=lambda x: x.get("totalScore", 0), reverse=True)
    return jsonify({"regions": docs, "count": len(docs)}), 200

if __name__ == "__main__":
    # run ETL once (on start) for provided dates, then start Flask
    print("Starting GDELT ETL...")
    try:
        res = run_gdelt_etl(GDELT_DATES)
        print("ETL finished:", res)
    except Exception as e:
        print("ETL error:", e)
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
