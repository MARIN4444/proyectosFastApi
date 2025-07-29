from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from db.database import engine, Base
from routes.task import router as task_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="To-Do List API",
    description="CRUD basico de tareas con FastAPI y SQLLite"
)

# Incluir las rutas de la API
app.include_router(task_router)

# Montar los archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ruta para servir el index.html en la raíz
@app.get("/")
async def read_root():
    return FileResponse("static/index.html")