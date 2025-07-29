from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
import models
from schemas.schema import TaskCreate, Task
import crud
router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Crear una tarea
@router.post("/", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = crud.get_task_by_id(db, task.id)
    if db_task:
        raise HTTPException(status_code=400, detail="Task already exists")
    return crud.create_task(db=db, task=task)

# Obtener todas las tareas
@router.get("/", response_model=list[Task])
def read_tasks(db: Session = Depends(get_db)):
    return crud.get_task(db)

# Obtener una tarea por id
@router.get("/{task_id}", response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task_by_id(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Actualizar una tarea
@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id, task)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Eliminar una tarea
@router.delete("/{task_id}", response_model=Task)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.delete_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task