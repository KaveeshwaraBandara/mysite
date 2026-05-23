from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


@app.get("/about")
def read_about():
    return {"name": "Imanchana", "role": "undergraduate", "learning": "full stack"}
