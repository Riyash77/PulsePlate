"""
PULSE PLATE – AI Demo Simulator
Simulates ANPR, Face Verification, Drowsiness, and Seatbelt detection
for demo/testing without actual camera hardware.

Usage: python demo_simulator.py
"""

import requests
import time
import random
import json
from datetime import datetime

API_BASE = "http://localhost:5000/api"

# Demo credentials (use any authenticated user)
LOGIN = {"email": "23ec094@kpriet.ac.in", "password": "23EC094"}

# Demo bus IDs (matches seed data)
BUSES = [
    {"id": "30000000-0000-0000-0000-000000000001", "plate": "TN33AB1234", "bus": "Bus 01", "driver_id": "20000000-0000-0000-0000-000000000001"},
    {"id": "30000000-0000-0000-0000-000000000002", "plate": "TN33CD5678", "bus": "Bus 02", "driver_id": "20000000-0000-0000-0000-000000000002"},
    {"id": "30000000-0000-0000-0000-000000000003", "plate": "TN33EF9012", "bus": "Bus 03", "driver_id": "20000000-0000-0000-0000-000000000003"},
    {"id": "30000000-0000-0000-0000-000000000004", "plate": "TN33GH3456", "bus": "Bus 04", "driver_id": "20000000-0000-0000-0000-000000000004"},
    {"id": "30000000-0000-0000-0000-000000000005", "plate": "TN33IJ7890", "bus": "Bus 05", "driver_id": "20000000-0000-0000-0000-000000000005"},
]

token = None
headers = {}


def login():
    global token, headers
    print("🔐 Logging in to API...")
    try:
        res = requests.post(f"{API_BASE}/auth/login", json=LOGIN)
        token = res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Logged in successfully")
        return True
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return False


def simulate_anpr(plate: str) -> dict:
    """Simulate ANPR with slight noise"""
    confidence = random.uniform(0.88, 0.99)
    # Occasionally simulate a plate read error
    if random.random() < 0.05:
        plate = plate[:-1] + random.choice("0123456789")
        confidence = random.uniform(0.70, 0.85)
    return {"plate": plate, "confidence": round(confidence, 3)}


def simulate_face_verify() -> dict:
    """Simulate face verification"""
    verified = random.random() > 0.08  # 8% mismatch rate
    confidence = random.uniform(0.85, 0.99) if verified else random.uniform(0.30, 0.60)
    return {
        "verified": verified,
        "confidence": round(confidence, 3),
        "mismatch_reason": None if verified else "Unknown person detected at driver seat"
    }


def simulate_drowsiness() -> bool:
    """Simulate drowsiness detection"""
    return random.random() < 0.06  # 6% drowsiness rate


def simulate_seatbelt() -> bool:
    """Simulate seatbelt detection"""
    return random.random() > 0.05  # 95% wear rate


def log_attendance(bus: dict, event_type: str):
    """POST attendance log to backend"""
    anpr = simulate_anpr(bus["plate"])
    print(f"\n{'=' * 50}")
    print(f"📸 {bus['bus']} – {event_type}")
    print(f"   Plate: {anpr['plate']} (confidence: {anpr['confidence']*100:.0f}%)")

    try:
        res = requests.post(
            f"{API_BASE}/attendance",
            headers=headers,
            json={
                "bus_id": bus["id"],
                "event_type": event_type,
                "plate_detected": anpr["plate"],
                "confidence_score": anpr["confidence"],
                "is_manual": False,
            }
        )
        data = res.json()
        log_id = data.get("log", {}).get("id")
        print(f"   ✅ Attendance logged: {event_type}")
        return log_id
    except Exception as e:
        print(f"   ❌ Failed to log attendance: {e}")
        return None


def log_verification(bus: dict, log_id: str):
    """POST driver verification to backend"""
    face = simulate_face_verify()
    drowsy = simulate_drowsiness()
    seatbelt = simulate_seatbelt()

    print(f"   🔍 Face: {'✅ Matched' if face['verified'] else '❌ MISMATCH!'} ({face['confidence']*100:.0f}%)")
    print(f"   😴 Drowsiness: {'⚠️  DETECTED!' if drowsy else '✅ Alert'}")
    print(f"   🪑 Seatbelt: {'✅ Worn' if seatbelt else '❌ NOT WORN!'}")

    try:
        requests.post(
            f"{API_BASE}/drivers/verify",
            headers=headers,
            json={
                "bus_id": bus["id"],
                "driver_id": bus["driver_id"],
                "attendance_log_id": log_id,
                "face_verified": face["verified"],
                "face_mismatch_reason": face["mismatch_reason"],
                "drowsiness_detected": drowsy,
                "seatbelt_detected": seatbelt,
                "confidence_score": face["confidence"],
            }
        )
        print(f"   ✅ Verification logged")
    except Exception as e:
        print(f"   ❌ Failed to log verification: {e}")


def run_morning_scenario():
    """Simulate morning bus arrivals (8:00 - 8:45 window)"""
    print("\n🌅 MORNING ENTRY SCENARIO")
    print("   Simulating buses arriving at campus gate...")
    shuffled = BUSES.copy()
    random.shuffle(shuffled)

    for i, bus in enumerate(shuffled):
        delay = random.uniform(30, 120)
        print(f"\n⏱  Next bus in {delay:.0f}s... (or press Ctrl+C to skip)")
        try:
            time.sleep(min(delay, 5))  # Cap at 5s for quick demo
        except KeyboardInterrupt:
            pass

        log_id = log_attendance(bus, "ENTRY")
        if log_id:
            time.sleep(1)
            log_verification(bus, log_id)


def run_evening_scenario():
    """Simulate evening bus exits"""
    print("\n🌆 EVENING EXIT SCENARIO")
    print("   Simulating buses departing from campus...")
    shuffled = BUSES.copy()
    random.shuffle(shuffled)

    for bus in shuffled:
        time.sleep(random.uniform(2, 5))
        log_id = log_attendance(bus, "EXIT")
        if log_id:
            time.sleep(1)
            log_verification(bus, log_id)


def run_continuous():
    """Run continuous simulation"""
    print("\n🔄 CONTINUOUS SIMULATION MODE")
    print("   Will randomly log entries and exits every 10-30 seconds")
    print("   Press Ctrl+C to stop")

    bus_states = {bus["id"]: "OUTSIDE" for bus in BUSES}

    while True:
        try:
            bus = random.choice(BUSES)
            current_state = bus_states[bus["id"]]
            event = "ENTRY" if current_state == "OUTSIDE" else "EXIT"

            log_id = log_attendance(bus, event)
            bus_states[bus["id"]] = "INSIDE" if event == "ENTRY" else "OUTSIDE"

            if log_id:
                time.sleep(2)
                log_verification(bus, log_id)

            sleep_time = random.uniform(10, 30)
            print(f"\n⏳ Next event in {sleep_time:.0f}s...")
            time.sleep(sleep_time)

        except KeyboardInterrupt:
            print("\n\n🛑 Simulation stopped")
            break


if __name__ == "__main__":
    print("=" * 60)
    print("  PULSE PLATE – AI Demo Simulator")
    print("  KPRIET Smart Transport System")
    print("=" * 60)
    print("\nScenarios:")
    print("  1. Morning Entry (5 buses arriving)")
    print("  2. Evening Exit (5 buses departing)")
    print("  3. Continuous (random events)")
    print("  4. Single event (interactive)")

    if not login():
        print("Cannot connect to backend. Make sure backend is running on port 5000.")
        exit(1)

    print("\nSelect scenario [1/2/3/4]: ", end="")
    try:
        choice = input().strip()
    except:
        choice = "3"

    if choice == "1":
        run_morning_scenario()
    elif choice == "2":
        run_evening_scenario()
    elif choice == "3":
        run_continuous()
    elif choice == "4":
        print("Select bus [1-5]: ", end="")
        bus_idx = int(input().strip()) - 1
        bus = BUSES[bus_idx % len(BUSES)]
        print("Event type [ENTRY/EXIT]: ", end="")
        event = input().strip().upper()
        log_id = log_attendance(bus, event)
        if log_id:
            log_verification(bus, log_id)
    else:
        print("Invalid choice, running continuous mode...")
        run_continuous()

    print("\n✅ Simulation complete!")
