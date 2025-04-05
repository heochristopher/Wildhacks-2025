from fastapi import APIRouter, Depends, HTTPException
from utils.auth import get_current_user

router = APIRouter(
    tags=["Levels"]
)

@router.get("/levels/{level}", summary="Retrieve Level Progress")
async def get_level_progress(level: int, current_user: dict = Depends(get_current_user)):
    if level not in [1, 2, 3]:
        raise HTTPException(status_code=400, detail="Invalid level. Must be 1, 2, or 3.")

    level_key = f"level{level}"
    progress = current_user.get("progress", {})
    level_data = progress.get(level_key)
    if not level_data:
        raise HTTPException(status_code=404, detail=f"No progress data found for level {level}.")
    return {level_key: level_data}
