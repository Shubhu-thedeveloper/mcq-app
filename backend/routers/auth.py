from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from backend.models import UserCreate, UserOut, Token, UserInDB
from backend.database import user_collection
from backend.utils.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = await user_collection.insert_one(user_dict)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    # Convert Object ID for response
    created_user["_id"] = str(created_user["_id"])
    return created_user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "id": str(user["_id"])}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
