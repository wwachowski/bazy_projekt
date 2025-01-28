// src/app/components/leave-application-statuses/leave-application-statuses.component.ts
import { Component, OnInit } from '@angular/core';
import { LeaveApplicationStatus } from '../../models/leave-application-status.model';
import { LeaveApplicationStatusService } from '../../services/api/leave-application-status.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-leave-application-statuses',
  templateUrl: './leave-application-statuses.component.html',
  styleUrls: ['./leave-application-statuses.component.css'],
  standalone: false,
})
export class LeaveApplicationStatusesComponent implements OnInit {
  statuses: LeaveApplicationStatus[] = [];
  isEditing: boolean = false;
  editedStatus: LeaveApplicationStatus | null = null;
  isAdding: boolean = false;
  newStatus: LeaveApplicationStatus = { ID: 0, IS_INITIAL: 0, NAME: '', CODE: '' };

  constructor(
    private statusService: LeaveApplicationStatusService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    this.statusService.getStatuses().subscribe(
      (data) => {
        this.statuses = data;
      },
      (error) => {
        this.dialogService.showMessage('Błąd podczas ładowania statusów: ' + error?.message);
      }
    );
  }

  startEdit(status: LeaveApplicationStatus): void {
    this.isEditing = true;
    this.editedStatus = { ...status };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedStatus = null;
  }

  saveEdit(): void {
    if (this.editedStatus) {
      this.statusService.updateStatus(this.editedStatus).subscribe(
        () => {
          this.loadStatuses();
          this.cancelEdit();
        },
        (error) => {
          this.dialogService.showMessage('Błąd podczas edytowania statusu: ' + error?.message);
        }
      );
    }
  }

  deleteStatus(statusId: number): void {
    this.statusService.deleteStatus(statusId).subscribe(
      () => {
        this.loadStatuses();
      },
      (error) => {
        this.dialogService.showMessage('Błąd podczas usuwania statusu: ' + error?.message);
      }
    );
  }

  addStatus(): void {
    this.isAdding = true;
    this.newStatus = { ID: 0, IS_INITIAL: 0, NAME: '', CODE: '' };
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.newStatus = { ID: 0, IS_INITIAL: 0, NAME: '', CODE: '' };
  }

  submitNewStatus(): void {
    this.statusService.addStatus(this.newStatus).subscribe(
      () => {
        this.loadStatuses();
        this.isAdding = false;
      },
      (error) => {
        this.dialogService.showMessage('Błąd podczas dodawania statusu: ' + error?.message);
      }
    );
  }
}
