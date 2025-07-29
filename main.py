from fastapi import FastAPI
from db.database import engine, Base
from routes.task import router as task_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="To-Do List API",
    description="CRUD basico de tareas con FastAPI y SQLLite"
)

app.include_router(task_router)