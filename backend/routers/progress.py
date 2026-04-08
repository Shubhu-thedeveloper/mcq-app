from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from backend.models import UserInDB
from backend.database import attempt_collection, session_collection
from backend.dependencies import get_current_user

router = APIRouter(
    prefix="/progress",
    tags=["Progress Analytics"],
)

@router.get("/")
async def get_progress(current_user: UserInDB = Depends(get_current_user)):
    user_id = str(current_user.id)
    
    # 1. Get test session history
    sessions_cursor = session_collection.find({"user_id": user_id}).sort("date", 1)
    sessions = await sessions_cursor.to_list(length=100)
    
    # Format sessions for charting
    history = []
    total_questions_attempted = 0
    total_correct = 0
    for s in sessions:
        total_questions_attempted += s["questions_attempted"]
        total_correct += s["correct_count"]
        history.append({
            "session_id": str(s["_id"]),
            "date": str(s["date"])[:10],
            "correct": s["correct_count"],
            "incorrect": s["incorrect_count"]
        })
        
    # 2. Get attempts summary
    attempts_cursor = attempt_collection.find({"user_id": user_id})
    attempts = await attempts_cursor.to_list(length=None)
    
    mastered_count = 0
    weak_count = 0
    
    for attempt in attempts:
        if attempt.get("first_attempt_correct"):
            mastered_count += 1
        elif attempt.get("next_review_date") is None:
            mastered_count += 1
        else:
            weak_count += 1
            
    accuracy = (total_correct / total_questions_attempted * 100) if total_questions_attempted > 0 else 0
            
    return {
        "history": history,
        "metrics": {
            "total_attempted": total_questions_attempted,
            "overall_accuracy": round(accuracy, 2),
            "mastered_questions": mastered_count,
            "weak_questions": weak_count
        }
    }
