from pydantic import BaseModel

class TaskBase(BaseModel):
    id: int | None = None
    title: str
    description: str

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    class Config:
        orm_mode = True