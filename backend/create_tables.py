import sys
import os
from pathlib import Path

# Backend folder ko Python path me add karo
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "app"))

# create_tables.py
from app.models import user, volunteer, alert, report  # apni files ke naam yahan likho
from app.core.database import engine
from app.core.database import Base

print("Creating tables...")
# Ye line sab tables create kar degi agar exist nahi karti
Base.metadata.create_all(bind=engine)

print("All tables created successfully!")
