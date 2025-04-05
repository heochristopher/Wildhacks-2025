from fastapi import APIRouter, Depends, HTTPException
from utils.auth import get_current_user

router = APIRouter(
    tags=["Dashboard"]
)

@router.get("/dashboard", summary="Retrieve Dashboard Progress")
async def get_dashboard_progress(current_user: dict = Depends(get_current_user)):
    progress = current_user.get("progress", {})
    if not progress:
        raise HTTPException(status_code=404, detail="No progress data found.")
    return {"progress": progress}