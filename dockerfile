# Usa una imagen base oficial con Python
FROM python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN pip install --upgrade pip
RUN pip install fastapi uvicorn sqlalchemy

# Exponer el puerto por donde correrá la app
EXPOSE 8000

# Comando para correr el servidor
CMD ["python", "-m","uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]