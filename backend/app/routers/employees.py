from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("", response_model=schemas.EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(models.Employee)
        .filter(
            (models.Employee.employee_id == employee.employee_id)
            | (models.Employee.email == employee.email)
        )
        .first()
    )
    if existing:
        if existing.employee_id == employee.employee_id:
            detail = "Employee ID already exists."
        else:
            detail = "Email already exists."
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

    new_employee = models.Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department,
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


@router.get("", response_model=list[schemas.EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).order_by(models.Employee.id).all()


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")

    db.delete(employee)
    db.commit()
    return None
