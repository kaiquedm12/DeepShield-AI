from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.schemas.user import UserOut


router = APIRouter(prefix="/user", tags=["user"])


@router.get("/me", response_model=UserOut)
def read_me(user=Depends(get_current_user)) -> UserOut:
    return user
