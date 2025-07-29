## To-Do List API con FastAPI

Este proyecto es una API REST básica para la gestión de tareas (To-Do List) desarrollada con **FastAPI** y **SQLite**. El objetivo principal es aprender y probar el funcionamiento de FastAPI en Python, implementando operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre una base de datos sencilla.

## Características

- Crear tareas con título y descripción.
- Consultar todas las tareas o una tarea específica por su ID.
- Actualizar tareas existentes.
- Eliminar tareas.
- Documentación automática generada por FastAPI (Swagger UI).

## Estructura del proyecto

FastApi1/
│  ├── crud.py
│  ├── main.py
│
│  ├── models/
│  │  ├── __init__.py
│  │  └── task.py              
│
│  ├── schemas/
│  │  ├── __init__.py
│  │  └── task.py                            
│
│  ├── routes/
│  │  ├── __init__.py
│  │  └── task.py                     
│
│  └── db/
│      ├── __init__.py
│      └── database.py 

## Requisitos

- Python 3.10 o superior
- Instalar dependencias con:
  ```bash
  pip install fastapi sqlalchemy uvicorn pydantic

Uso de la API
POST /tasks/: Crear una nueva tarea.
GET /tasks/: Obtener todas las tareas.
GET /tasks/{task_id}: Obtener una tarea por su ID.
PUT /tasks/{task_id}: Actualizar una tarea existente.
DELETE /tasks/{task_id}: Eliminar una tarea.
Documentación
FastAPI genera automáticamente la documentación Swagger en /docs.