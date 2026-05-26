from contextlib import asynccontextmanager

from fastapi import FastAPI


from app.database import create_db_and_tables
from app.models import Message


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
