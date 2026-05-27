from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from sqlmodel import Session, select


from app.database import create_db_and_tables, get_session
from app.models import Message, MessageCreate


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


@app.get("/about")
def read_about():
    return {"name": "Imanchana", "role": "undergraduate", "learning": "full stack"}


@app.post("/messages")
def create_message(
    message: MessageCreate,
    session: Session = Depends(get_session),
):
    db_message = Message(name=message.name, content=message.content)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message


@app.get("/messages")
def read_message(session: Session = Depends(get_session)):
    statement = select(Message)
    messages = session.exec(statement).all()
    return messages