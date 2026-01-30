from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_users: Dict[int, WebSocket] = {}
        self.active_volunteers: Dict[int, WebSocket] = {}

    async def connect_user(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_users[user_id] = websocket

    async def connect_volunteer(self, volunteer_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_volunteers[volunteer_id] = websocket

    def disconnect_user(self, user_id: int):
        self.active_users.pop(user_id, None)

    def disconnect_volunteer(self, volunteer_id: int):
        self.active_volunteers.pop(volunteer_id, None)

    async def send_to_user(self, user_id: int, data: dict):
        ws = self.active_users.get(user_id)
        if ws:
            await ws.send_json(data)

    async def send_to_volunteer(self, volunteer_id: int, data: dict):
        ws = self.active_volunteers.get(volunteer_id)
        if ws:
            await ws.send_json(data)

manager = ConnectionManager()
