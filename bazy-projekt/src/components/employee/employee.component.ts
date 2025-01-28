// src/app/components/employee-crud/employee-crud.component.ts
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/api/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: false,
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  isEditing: boolean = false;
  editedEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      console.log(data);
    });
  }

  startEdit(employee: Employee): void {
    this.isEditing = true;
    this.editedEmployee = { ...employee }; // Kopia do edytowania
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedEmployee = null;
  }

  saveEdit(): void {
    if (this.editedEmployee) {
      console.log(this.editedEmployee);
      this.employeeService.updateEmployee(this.editedEmployee).subscribe(() => {
        this.loadEmployees(); // Przeładuj dane po edycji
        this.cancelEdit();
      });
    }
  }

  deleteEmployee(employeeId: number): void {
    if (confirm('Czy na pewno chcesz usunąć tego pracownika?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe(() => {
        this.loadEmployees(); // Przeładuj dane po usunięciu
      });
    }
  }

  addEmployee(): void {
    const newEmployee: Employee = { ID: 0, USER_ID: 0, EMPLOYEE_TYPE: 'N' }; // Przykład nowego pracownika
    this.employeeService.addEmployee(newEmployee).subscribe(() => {
      this.loadEmployees(); // Przeładuj dane po dodaniu
    });
  }
}
