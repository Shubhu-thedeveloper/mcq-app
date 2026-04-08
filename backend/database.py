import motor.motor_asyncio
import os

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.mcq_platform

user_collection = database.get_collection("users")
question_collection = database.get_collection("questions")
attempt_collection = database.get_collection("user_attempts")
session_collection = database.get_collection("test_sessions")
