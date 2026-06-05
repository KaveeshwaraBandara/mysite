from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_user
from app.models import Message, MessageCreate, User


router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("")
def create_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    db_message = Message(content=message.content, user_id=current_user.id)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message


@router.get("")
def read_messages(session: Session = Depends(get_session)):
    statement = select(Message)
    messages = session.exec(statement).all()
    return messages