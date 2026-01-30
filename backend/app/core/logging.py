"""
Central logging setup.
Used for debugging and production logs.
"""

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("silent_shield")
