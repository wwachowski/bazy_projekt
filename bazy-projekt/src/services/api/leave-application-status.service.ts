// src/app/services/api/leave-application-status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveApplicationStatus } from '../../models/leave-application-status.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveApplicationStatusService {
  private apiUrl = 'http://localhost:3000/api/leave-application-statuses';

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<LeaveApplicationStatus[]> {
    return this.http.get<LeaveApplicationStatus[]>(this.apiUrl);
  }

  addStatus(status: LeaveApplicationStatus): Observable<LeaveApplicationStatus> {
    return this.http.post<LeaveApplicationStatus>(this.apiUrl, status);
  }

  updateStatus(status: LeaveApplicationStatus): Observable<LeaveApplicationStatus> {
    return this.http.put<LeaveApplicationStatus>(`${this.apiUrl}/${status.ID}`, status);
  }

  deleteStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
