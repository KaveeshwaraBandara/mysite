from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class UserCreate(SQLModel):
    username: str
    password: str


class UserRead(SQLModel):
    id: int
    username: str
    created_at: datetime


class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    #name: str
    content: str
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(
            default_factory=lambda: datetime.now(timezone.utc)
    )


class MessageCreate(SQLModel):
    #name: str
    content: str