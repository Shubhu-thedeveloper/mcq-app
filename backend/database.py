import motor.motor_asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
import certifi

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGO_DETAILS = os.getenv("MONGO_URI")

if not MONGO_DETAILS:
    raise Exception("MONGO_URI missing")

client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_DETAILS,
    tls=True,
    tlsAllowInvalidCertificates=True,
    tlsCAFile=certifi.where(),   # ✅ REQUIRED
)

database = client.mcq_platform

user_collection = database.get_collection("users")
question_collection = database.get_collection("questions")
attempt_collection = database.get_collection("user_attempts")
session_collection = database.get_collection("test_sessions")