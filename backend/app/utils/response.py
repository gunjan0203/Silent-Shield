"""
Standard API responses
"""

from fastapi.responses import JSONResponse

def success(data, message="Success"):
    return JSONResponse({"status": "success", "message": message, "data": data})

def error(message="Error", status_code=400):
    return JSONResponse({"status": "error", "message": message}, status_code=status_code)
