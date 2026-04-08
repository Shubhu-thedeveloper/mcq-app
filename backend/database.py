import motor.motor_asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

# Fix: Load .env from the backend directory specifically
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGO_DETAILS = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.mcq_platform

user_collection = database.get_collection("users")
question_collection = database.get_collection("questions")
attempt_collection = database.get_collection("user_attempts")
session_collection = database.get_collection("test_sessions")
