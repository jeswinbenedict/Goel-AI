import requests
import json

BASE = "http://localhost:5000"

def ok(label, passed):
    print(f"  {'✅' if passed else '❌'}  {label}")

def section(title):
    print(f"\n{'─'*40}")
    print(f"  🔍 {title}")
    print(f"{'─'*40}")

# ── 1. Root ──────────────────────────────────────
section("Root")
r = requests.get(f"{BASE}/")
ok("Backend online",       r.status_code == 200)
ok("Returns message",      "message" in r.json())

# ── 2. Health ────────────────────────────────────
section("GET /api/health")
r = requests.get(f"{BASE}/api/health")
ok("Status 200",           r.status_code == 200)
ok("Fuzzy model active",   r.json()["models"]["fuzzy"] == "Active")
ok("PSO model active",     r.json()["models"]["pso"]   == "Active")

# ── 3. Fuzzy Score ───────────────────────────────
section("POST /api/fuzzy-score")

# CRITICAL case
r = requests.post(f"{BASE}/api/fuzzy-score", json={"heat": 90, "void": 85, "hours": 5})
ok("Status 200",                r.status_code == 200)
ok("Has survival_score",        "survival_score" in r.json())
ok("Has zone",                  "zone" in r.json())
ok("High inputs → CRITICAL",    r.json()["zone"] == "CRITICAL")
print(f"     → score={r.json()['survival_score']}  zone={r.json()['zone']}")

# LOW case
r = requests.post(f"{BASE}/api/fuzzy-score", json={"heat": 10, "void": 10, "hours": 70})
ok("Low inputs → LOW zone",     r.json()["zone"] == "LOW")
print(f"     → score={r.json()['survival_score']}  zone={r.json()['zone']}")

# Default values
r = requests.post(f"{BASE}/api/fuzzy-score", json={})
ok("Empty body uses defaults",  r.status_code == 200)

# ── 4. PSO Route Optimizer ───────────────────────
section("POST /api/optimize-routes")
payload = {
    "survivors": [
        [35.694, 139.753], [35.689, 139.700],
        [35.701, 139.730], [35.710, 139.745]
    ],
    "teams": [
        [35.675, 139.720], [35.705, 139.760]
    ]
}
r = requests.post(f"{BASE}/api/optimize-routes", json=payload)
ok("Status 200",                r.status_code == 200)
ok("Has routes",                "routes"      in r.json())
ok("Has total_cost",            "total_cost"  in r.json())
ok("Has iterations",            "iterations"  in r.json())
ok("Correct team count",        len(r.json()["routes"]) == 2)
for route in r.json()["routes"]:
    print(f"     → {route['team']} assigned to {route['target']}")

# ── 5. USGS Earthquake Feed ──────────────────────
section("GET /api/earthquake-live")
r = requests.get(f"{BASE}/api/earthquake-live")
ok("Status 200",                r.status_code == 200)
ok("Has earthquakes list",      "earthquakes" in r.json())
ok("Has count",                 "count"       in r.json())
ok("Returns up to 10 quakes",   r.json()["count"] <= 10)
if r.json()["earthquakes"]:
    q = r.json()["earthquakes"][0]
    ok("Each quake has magnitude",  "magnitude" in q)
    ok("Each quake has place",      "place"     in q)
    ok("Each quake has lat/lng",    "lat" in q and "lng" in q)
    print(f"     → Top quake: M{q['magnitude']} — {q['place']}")

# ── 6. Thermal Analysis ──────────────────────────
section("POST /api/analyze-thermal")
r = requests.post(f"{BASE}/api/analyze-thermal", json={})
ok("Status 200",                    r.status_code == 200)
ok("Has survivors_detected",        "survivors_detected" in r.json())
ok("Has confidence",                "confidence"         in r.json())
ok("Has zone",                      "zone"               in r.json())
ok("Has processing_time_ms",        "processing_time_ms" in r.json())
ok("Confidence 75-97%",             75 <= r.json()["confidence"] <= 97)
print(f"     → {r.json()['survivors_detected']} survivors · {r.json()['confidence']}% confidence · {r.json()['zone']}")

# ── 7. CORS Headers ──────────────────────────────
section("CORS Headers")
r = requests.options(f"{BASE}/api/health", headers={"Origin": "http://localhost:5173"})
ok("CORS allows localhost:5173",
   "localhost:5173" in r.headers.get("Access-Control-Allow-Origin", "") or
   "*"              in r.headers.get("Access-Control-Allow-Origin", ""))

# ── Summary ──────────────────────────────────────
print(f"\n{'═'*40}")
print("  🏁 All tests complete!")
print(f"{'═'*40}\n")
