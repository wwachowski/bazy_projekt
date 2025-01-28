import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveApplicationAction } from '../../models/leave-application-action.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveApplicationActionService {
  private apiUrl = 'http://localhost:3000/api/leave-application-actions';

  constructor(private http: HttpClient) {}

  getActions(): Observable<LeaveApplicationAction[]> {
    return this.http.get<LeaveApplicationAction[]>(this.apiUrl);
  }

  addAction(action: LeaveApplicationAction): Observable<LeaveApplicationAction> {
    return this.http.post<LeaveApplicationAction>(this.apiUrl, action);
  }

  updateAction(action: LeaveApplicationAction): Observable<LeaveApplicationAction> {
    return this.http.put<LeaveApplicationAction>(`${this.apiUrl}/${action.ID}`, action);
  }

  deleteAction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
