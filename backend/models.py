from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import List, Optional, Any, Annotated
from datetime import datetime, date
from bson import ObjectId

# Pydantic v2 way to handle MongoDB ObjectIds
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(BaseModel):
    id: PyObjectId = Field(alias="_id")
    email: EmailStr
    hashed_password: str
    created_at: datetime

    class Config:
        populate_by_name = True

class UserOut(UserBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime
    
    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Option(BaseModel):
    key: str
    text: str

class QuestionModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    question_text: str
    options: List[Option]
    correct_answer: str

    class Config:
        populate_by_name = True

class QuestionResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    question_text: str
    options: List[Option]
    # correct_answer is omitted for the client side

    class Config:
        populate_by_name = True

class UserAttempt(BaseModel):
    user_id: PyObjectId
    question_id: PyObjectId
    first_attempt_correct: Optional[bool] = None
    last_attempt_date: datetime
    next_review_date: Optional[datetime] = None

class AnswerSubmission(BaseModel):
    question_id: str
    selected_key: str

class TestSubmission(BaseModel):
    answers: List[AnswerSubmission]

class TestSession(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId
    date: date
    questions_attempted: int
    correct_count: int
    incorrect_count: int

    class Config:
        populate_by_name = True
