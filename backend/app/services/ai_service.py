"""
AI logic for Silent Shield:
- Panic level classification
- Report risk-level analysis
- Can integrate HuggingFace or any ML model
"""

from app.core.config import settings

# Dummy mapping for simplicity (can replace with real ML)
PANIC_MAPPING = {
    "SOS": "HIGH",
    "HELP": "MEDIUM",
    "SAFE": "LOW"
}

RISK_MAPPING = {
    "minor": "LOW",
    "suspicious": "MEDIUM",
    "danger": "HIGH"
}

def classify_panic(code: str) -> str:
    """
    Converts code/short word to panic level.
    """
    return PANIC_MAPPING.get(code.upper(), "LOW")

def analyze_report(description: str) -> str:
    """
    Dummy risk level classifier.
    """
    desc_lower = description.lower()
    if "danger" in desc_lower or "attack" in desc_lower:
        return "HIGH"
    elif "suspicious" in desc_lower:
        return "MEDIUM"
    else:
        return "LOW"
