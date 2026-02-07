from datetime import date
from enum import Enum
from typing import List

from pydantic import BaseModel, EmailStr


class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"


class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        orm_mode = True


class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus


class AttendanceCreate(AttendanceBase):
    employee_id: str


class AttendanceResponse(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        orm_mode = True


class EmployeeAttendanceResponse(BaseModel):
    employee_id: str
    records: List[AttendanceResponse]
