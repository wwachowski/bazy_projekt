// src/app/services/api/leave-type.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveType } from '../../models/leave-type.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  private apiUrl = 'http://localhost:3000/api/leave-types';

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(this.apiUrl);
  }

  addLeaveType(leaveType: LeaveType): Observable<LeaveType> {
    return this.http.post<LeaveType>(this.apiUrl, leaveType);
  }

  updateLeaveType(leaveType: LeaveType): Observable<LeaveType> {
    return this.http.put<LeaveType>(`${this.apiUrl}/${leaveType.ID}`, leaveType);
  }

  deleteLeaveType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
