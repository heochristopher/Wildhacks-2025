# routes/submit_test.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from utils.auth import get_current_user
from utils.db import table
from botocore.exceptions import ClientError

router = APIRouter(
    tags=["Test Submission"]
)

class SubmitTestRequest(BaseModel):
    level: int
    score: str   # Test score as a percentage (e.g., 0.8) — convert to float for db
    difficulty: str

@router.post("/submitTest", summary="Submit Test")
async def submit_test(request: SubmitTestRequest, current_user: dict = Depends(get_current_user)):
    level_key = f"level{request.level}"
    progress = current_user.setdefault("progress", {})
    level_progress = progress.setdefault(level_key, {})
    
    level_progress["test"] = {
        "score": request.score,
        "difficulty": request.difficulty,
        "questions": []  # Update as needed
    }
    
    try:
        table.put_item(Item=current_user)
    except ClientError:
        raise HTTPException(status_code=500, detail="Error updating test submission.")
    return {"msg": "Test submitted successfully.", "test": level_progress["test"]}
