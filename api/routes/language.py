from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from utils.auth import get_current_user
from utils.db import table
from botocore.exceptions import ClientError

router = APIRouter(
    tags=["User Settings"]
)

class LanguageUpdateRequest(BaseModel):
    language: str

@router.post("/languages", summary="Update User Language Preference")
async def update_language(request: LanguageUpdateRequest, current_user: dict = Depends(get_current_user)):
    print("ASDASDA")
    current_user["language"] = request.language
    try:
        table.put_item(Item=current_user)
    except ClientError:
        raise HTTPException(status_code=500, detail="Error updating language preference.")
    return {"msg": "Language preference updated.", "language": request.language}
