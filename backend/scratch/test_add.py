import requests

data = {
    "name": "Test Intern",
    "email": "testintern@example.com",
    "role": "QA",
    "start_date": "2024-01-01",
    "end_date": "2024-06-01"
}

try:
    response = requests.post("http://localhost:8000/interns", json=data)
    print("Status:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)
