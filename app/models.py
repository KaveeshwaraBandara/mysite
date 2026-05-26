from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    content: str
    created_at: datetime = Field(
            default_factory=lambda: datetime.now(timezone.utc)
    )
