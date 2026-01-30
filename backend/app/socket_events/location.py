from app.socket import sio

@sio.event
async def connect(sid, environ):
    print("Socket connected:", sid)

@sio.event
async def join_alert_room(sid, data):
    alert_id = data["alert_id"]
    await sio.enter_room(sid, f"alert_{alert_id}")

@sio.event
async def send_location(sid, data):
    alert_id = data["alert_id"]

    await sio.emit(
        "location_update",
        {
            "lat": data["latitude"],
            "lng": data["longitude"]
        },
        room=f"alert_{alert_id}"
    )
