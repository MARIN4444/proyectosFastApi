from sqlalchemy.orm import Session
from models.model import Task
from schemas.schema import TaskCreate
# *Obtener todas las tareas
def get_task(db: Session):
    return db.query(Task).all()

# *Obtener una tarea por su id
def get_task_by_id(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

# *Crear una nueva tarea
def create_task(db: Session, task:TaskCreate): 
    db_task = Task(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    print("Tarea creada exitosamente")
    return db_task

# *Actualizar una tarea
def update_task(db: Session, task_id: int, task:TaskCreate):
    db_task = get_task_by_id(db, task_id)
    if db_task:
        db_task.title = task.title
        db_task.description = task.description
        db.commit()
        db.refresh(db_task)
    else:
        print("La tarea no existe")    
    print("Tarea Actualizada exitosamente")
    return db_task

# *Eliminar una tarea
def delete_task(db: Session, task_id: int):
    db_task = get_task_by_id(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    print("Tarea eliminada exitosamente")
    return db_task
