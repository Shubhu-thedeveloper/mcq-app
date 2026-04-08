from fastapi import APIRouter, Depends, HTTPException
from backend.models import QuestionResponse, UserInDB, TestSubmission, TestSession, QuestionModel
from backend.database import question_collection, attempt_collection, session_collection
from backend.dependencies import get_current_user
from datetime import datetime, timedelta
from bson import ObjectId
import random

router = APIRouter(
    prefix="/test",
    tags=["Test Session"],
)

@router.get("/start", response_model=list[QuestionResponse])
async def start_test(current_user: UserInDB = Depends(get_current_user)):
    user_id = str(current_user.id)
    now = datetime.utcnow()
    
    # 1. Fetch questions due for review
    due_attempts_cursor = attempt_collection.find({
        "user_id": user_id,
        "next_review_date": {"$lte": now, "$ne": None}
    })
    due_attempts = await due_attempts_cursor.to_list(length=30)
    due_q_ids = [attempt["question_id"] for attempt in due_attempts]
    
    # 2. Fetch all attempted question IDs (to exclude them from 'new' pool)
    all_attempts_cursor = attempt_collection.find({"user_id": user_id}, {"question_id": 1})
    all_attempts = await all_attempts_cursor.to_list(length=None)
    all_attempted_q_ids = [attempt["question_id"] for attempt in all_attempts]
    
    # Needs 30 items
    review_limit = 30
    selected_due_q_ids = [ObjectId(qid) for qid in due_q_ids[:review_limit]]
    
    # 3. Pull actual question documents for the review
    questions = []
    if selected_due_q_ids:
        due_q_cursor = question_collection.find({"_id": {"$in": selected_due_q_ids}})
        questions = await due_q_cursor.to_list(length=review_limit)
    
    # 4. Fill remaining with new questions
    remaining_count = 30 - len(questions)
    
    if remaining_count > 0:
        obj_all_attempted_q_ids = [ObjectId(qid) for qid in all_attempted_q_ids]
        # Get random questions not in all_attempted_q_ids
        new_q_cursor = question_collection.aggregate([
            {"$match": {"_id": {"$nin": obj_all_attempted_q_ids}}},
            {"$sample": {"size": remaining_count}}
        ])
        new_questions = await new_q_cursor.to_list(length=remaining_count)
        questions.extend(new_questions)
        
    for q in questions:
        q["_id"] = str(q["_id"])
        
    return questions


@router.post("/submit")
async def submit_test(submission: TestSubmission, current_user: UserInDB = Depends(get_current_user)):
    user_id = str(current_user.id)
    now = datetime.utcnow()
    
    correct_count = 0
    incorrect_count = 0
    
    # Extract IDs to fetch correct answers efficiently
    q_ids = [ans.question_id for ans in submission.answers]
    q_obj_ids = [ObjectId(qid) for qid in q_ids]
    q_cursor = question_collection.find({"_id": {"$in": q_obj_ids}})
    db_questions = await q_cursor.to_list(length=len(q_ids))
    db_map = {str(q["_id"]): q for q in db_questions}
    
    details = []
    
    for answer in submission.answers:
        q_id = answer.question_id
        q_doc = db_map.get(q_id)
        if not q_doc:
            continue
            
        correct_key = q_doc.get("correct_answer")
        is_correct = (answer.selected_key == correct_key)
        
        details.append({
            "question_id": q_id,
            "question_text": q_doc.get("question_text"),
            "options": q_doc.get("options"),
            "selected_key": answer.selected_key,
            "correct_key": correct_key,
            "is_correct": is_correct
        })
        
        if is_correct:
            correct_count += 1
        else:
            incorrect_count += 1
            
        # Check existing attempt
        existing_attempt = await attempt_collection.find_one({
            "user_id": user_id,
            "question_id": q_id
        })
        
        if existing_attempt:
            # It's a review
            update_data = {
                "last_attempt_date": now,
            }
            if is_correct:
                update_data["next_review_date"] = None # Mastered
            else:
                update_data["next_review_date"] = now + timedelta(days=3) # Re-review
                
            await attempt_collection.update_one(
                {"_id": existing_attempt["_id"]},
                {"$set": update_data}
            )
        else:
            # First attempt
            new_attempt = {
                "user_id": user_id,
                "question_id": q_id,
                "first_attempt_correct": is_correct,
                "last_attempt_date": now,
                "next_review_date": None if is_correct else now + timedelta(days=3)
            }
            await attempt_collection.insert_one(new_attempt)

    session_record = {
        "user_id": user_id,
        "date": now,
        "questions_attempted": len(submission.answers),
        "correct_count": correct_count,
        "incorrect_count": incorrect_count
    }
    
    result = await session_collection.insert_one(session_record)
    
    return {
        "message": "Test submitted successfully",
        "session_id": str(result.inserted_id),
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "details": details
    }
