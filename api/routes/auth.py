# routes/auth.py
from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel, EmailStr
from botocore.exceptions import ClientError
from utils.db import table
import jwt
import os
from dotenv import load_dotenv
load_dotenv()
import bcrypt

router = APIRouter(
    tags=["Authentication"]
)

class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/register", summary="Register a New User")
async def register(request: RegisterRequest, response: Response):
    try:
        existing = table.get_item(Key={'email': request.email})
    except ClientError as e:
        raise HTTPException(status_code=500, detail="Database error.")
    
    if 'Item' in existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    hashed_password = hash_password(request.password)

    new_user = {
        "email": request.email,
        "firstName": request.firstName,
        "lastName": request.lastName,
        "password": hashed_password,
        "progress": {
            "level1": {"learning": {"lastCompleted": 0, "score": -1}, "test": {"score": -1}},
            "level2": {"learning": {"questions": [], "lastCompleted": 0, "score": -1, "difficulty": "medium"}, "test": {"questions": [], "score": -1, "difficulty": "medium"}},
            "level3": {"reading": {"questions": [], "lastCompleted": 0, "score": -1, "difficulty": "medium"}, "test": {"questions": [], "lastCompleted": 0, "score": -1, "difficulty": "medium"}}
        }
    }
    try:
        table.put_item(Item=new_user)
    except ClientError:
        raise HTTPException(status_code=500, detail="Error saving user.")
    
    # Generate a dummy JWT token (in production, include a proper expiration and sign with your secret)
    token = jwt.encode({"email": request.email}, os.getenv('SECRET_KEY'), algorithm=os.getenv('ALGORITHM'))
    response.set_cookie(key="access_token", value=token, httponly=True)
    return {"msg": "User registered successfully."}

@router.post("/login", summary="User Login")
async def login(request: LoginRequest, response: Response):
    try:
        result = table.get_item(Key={'email': request.email})
    except ClientError:
        raise HTTPException(status_code=500, detail="Database error.")
    
    if 'Item' not in result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = result['Item']
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode({"email": request.email}, os.getenv('SECRET_KEY'), algorithm=os.getenv('ALGORITHM'))
    response.set_cookie(key="access_token", value=token, httponly=True)
    return {"msg": "User logged in successfully."}
