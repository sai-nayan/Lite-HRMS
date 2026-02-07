from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    employee = (
        db.query(models.Employee)
        .filter(models.Employee.employee_id == attendance.employee_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    existing = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.employee_id == employee.id,
            models.Attendance.date == attendance.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance for this date already exists.",
        )

    record = models.Attendance(
        employee_id=employee.id,
        date=attendance.date,
        status=attendance.status.value,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{employee_id}", response_model=schemas.EmployeeAttendanceResponse)
def list_attendance(employee_id: str, db: Session = Depends(get_db)):
    employee = (
        db.query(models.Employee)
        .filter(models.Employee.employee_id == employee_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    records = (
        db.query(models.Attendance)
        .filter(models.Attendance.employee_id == employee.id)
        .order_by(models.Attendance.date.desc())
        .all()
    )
    return {"employee_id": employee.employee_id, "records": records}
