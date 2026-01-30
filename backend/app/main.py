from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import socket
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

#-----------------TOKEN AUTH SCHEME -----------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ----------------- MIDDLEWARES -----------------

from app.middlewares.auth_middleware import AuthMiddleware
from app.middlewares.error_middleware import global_exception_handler
from app.middlewares.rate_limit import RateLimitMiddleware

# ----------------- ROUTERS -----------------
from app.api.routes import auth, alerts, reports, volunteers, heatmap, ai, users

# ----------------- LOGGING -----------------
from app.core.logging import logger

# ----------------- CREATE APP -----------------
app = FastAPI(title="Silent Shield", version="1.0")

from fastapi.staticfiles import StaticFiles

# Mount static folder
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ----------------- MIDDLEWARES -----------------
# Global error handler
app.add_exception_handler(Exception, global_exception_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ya frontend ka URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Auth Middleware
# app.add_middleware(AuthMiddleware)

# Rate limiting (optional but recommended)
app.add_middleware(RateLimitMiddleware, max_requests=5, window_seconds=10)

# ----------------- ROUTERS -----------------
app.include_router(auth.router)
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(volunteers.router, prefix="/volunteers", tags=["Volunteers"])
app.include_router(heatmap.router, prefix="/heatmap", tags=["Heatmap"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(users.router, prefix="/users", tags=["Users"])

# ----------------- ROOT -----------------
@app.get("/")
def root():
    return JSONResponse({"message": "Welcome to Silent Shield Backend!"})


# ----------------- WEBSOCKETS -----------------
app.include_router(socket.router)