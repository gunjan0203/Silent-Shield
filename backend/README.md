# Silent Shield Backend

AI-based, community-driven public safety backend.

## Features
- Signup/Login (USER/VOLUNTEER)
- Guest SOS (skip login)
- Panic code classification (AI)
- Reports for area safety
- Assign alerts to verified volunteers
- Heatmap generation
- JWT authentication & rate-limiting

## Tech Stack
- Python, FastAPI
- MySQL (SQLAlchemy ORM)
- Passlib, Python-Jose for security

## Setup
1. Clone repo
2. Create `.env` (see example)
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
