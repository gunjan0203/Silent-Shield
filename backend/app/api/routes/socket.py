from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.socket_manager import manager

router = APIRouter()

@router.websocket("/ws/user/{user_id}")
async def user_socket(websocket: WebSocket, user_id: int):
    await manager.connect_user(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_user(user_id)

@router.websocket("/ws/volunteer/{volunteer_id}")
async def volunteer_socket(websocket: WebSocket, volunteer_id: int):
    await manager.connect_volunteer(volunteer_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_volunteer(volunteer_id)
