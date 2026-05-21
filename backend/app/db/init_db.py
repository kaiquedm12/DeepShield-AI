from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User


def init_db(db: Session) -> None:
    admin = db.query(User).filter(User.email == "admin@deepshield.ai").first()
    if admin:
        return
    user = User(
        email="admin@deepshield.ai",
        full_name="Admin",
        hashed_password=get_password_hash("Admin123!"),
        is_active=True,
    )
    db.add(user)
    db.commit()
