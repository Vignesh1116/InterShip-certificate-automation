import requests

try:
    internship_id = "INT-9226" # from the previous step
    response = requests.post(f"http://localhost:8000/generate/intern/{internship_id}")
    print("Status:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)
