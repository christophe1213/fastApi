from fastapi import FastAPI
from app.routes import tasksRouter
app = FastAPI()
@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(tasksRouter.router)





