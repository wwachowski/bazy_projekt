// src/app/models/employee.model.ts
export interface Employee {
  ID: number;
  USER_ID: number;
  EMPLOYEE_TYPE: 'A' | 'N'; // Administrator / Normal
}
