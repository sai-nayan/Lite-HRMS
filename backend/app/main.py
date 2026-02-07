from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import attendance, employees

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)


@app.get("/")
def root():
    return {"message": "HRMS Lite API is running."}
