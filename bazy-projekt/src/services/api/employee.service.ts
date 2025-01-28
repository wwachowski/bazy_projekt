// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/api/employees';  // Używamy tego samego URL co w pozostałych metodach

  constructor(private http: HttpClient) {}

  // Funkcja do pobierania pracowników
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // Funkcja do aktualizowania pracownika
  updateEmployee(employee: Employee): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employee.ID}`, employee);
  }

  // Funkcja do usuwania pracownika
  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${employeeId}`);
  }

  // Funkcja do dodawania nowego pracownika
  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.apiUrl, employee);
  }
}
