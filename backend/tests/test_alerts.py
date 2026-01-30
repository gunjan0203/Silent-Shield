import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_guest_alert():
    response = client.post("/alerts/guest", json={
        "code": "SOS",
        "message": "Test emergency",
        "latitude": 12.9716,
        "longitude": 77.5946
    })
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == "SOS"
    assert "panic_level" in data
