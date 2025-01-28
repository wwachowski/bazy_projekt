// src/app/components/employee-crud/employee-crud.component.ts
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/api/employee.service';
import { DialogService } from '../../services/dialog.service';  // Importujemy serwis

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
  isAdding: boolean = false;
  newEmployee: Employee = { ID: 0, EMPLOYEE_TYPE: 'N', USER_ID: 0 };

  constructor(
    private employeeService: EmployeeService,
    private dialogService: DialogService  // Wstrzykujemy serwis
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Błąd podczas ładowania pracowników:', error);
        this.dialogService.showMessage('Błąd podczas ładowania pracowników:\n' + error?.message);
      }
    );
  }

  startEdit(employee: Employee): void {
    this.isEditing = true;
    this.editedEmployee = { ...employee };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedEmployee = null;
  }

  saveEdit(): void {
    if (this.editedEmployee) {
      this.employeeService.updateEmployee(this.editedEmployee).subscribe(
        (response) => {
          console.log('Zaktualizowano pracownika:', response);
          this.loadEmployees();
          this.isEditing = false;
          this.editedEmployee = null;
        },
        (error) => {
          console.error('Błąd podczas edytowania pracownika:', error);
          this.dialogService.showMessage('Błąd podczas edytowania pracownika:\n' + error?.message);
        }
      );
    }
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response) => {
        console.log('Usunięto pracownika:', response);
        this.loadEmployees();
      },
      (error) => {
        console.error('Błąd podczas usuwania pracownika:', error);
        this.dialogService.showMessage('Błąd podczas usuwania pracownika:\n' + error?.message);
      }
    );
  }

  addEmployee(): void {
    this.isAdding = true;
    this.newEmployee = { ID: 0, EMPLOYEE_TYPE: 'N', USER_ID: 0 };
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.newEmployee = { ID: 0, EMPLOYEE_TYPE: 'N', USER_ID: 0 };
  }

  submitNewEmployee(): void {
    this.employeeService.addEmployee(this.newEmployee).subscribe(
      (response) => {
        console.log('Dodano nowego pracownika:', response);
        this.loadEmployees();
        this.isAdding = false;
      },
      (error) => {
        console.error('Błąd podczas dodawania pracownika:', error);
        this.dialogService.showMessage('Błąd podczas dodawania pracownika:\n' + error?.message);
      }
    );
  }
}
