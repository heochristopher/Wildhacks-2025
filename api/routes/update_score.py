from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from utils.auth import get_current_user
from utils.db import table
from botocore.exceptions import ClientError

router = APIRouter(
    tags=["Learning Progress"]
)

class UpdateScoreRequest(BaseModel):
    level: int
    score: str   # Learning score (e.g., 0.8)
    lastCompleted: int  # Index for the last completed item

@router.post("/updateScore", summary="Update Learning Score")
async def update_score(request: UpdateScoreRequest, current_user: dict = Depends(get_current_user)):
    level_key = f"level{request.level}"
    progress = current_user.setdefault("progress", {})
    level_progress = progress.setdefault(level_key, {})
    
    # For level 3, the key for learning progress is "reading" otherwise it's "learning"
    learning_key = "reading" if request.level == 3 else "learning"
    
    level_progress[learning_key] = {
        "score": request.score,
        "lastCompleted": request.lastCompleted,
        "questions": level_progress.get(learning_key, {}).get("questions", [])
    }
    
    try:
        table.put_item(Item=current_user)
    except ClientError:
        raise HTTPException(status_code=500, detail="Error updating learning score.")
    return {"msg": "Learning score updated successfully.", learning_key: level_progress[learning_key]}
