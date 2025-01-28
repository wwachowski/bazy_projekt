// src/app/components/leave-type-crud/leave-type-crud.component.ts
import { Component, OnInit } from '@angular/core';
import { LeaveType } from '../../models/leave-type.model';
import { LeaveTypeService } from '../../services/api/leave-type.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-types.component.html',
  styleUrls: ['./leave-types.component.css'],
  standalone: false,
})
export class LeaveTypeComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  isEditing: boolean = false;
  editedLeaveType: LeaveType | null = null;
  isAdding: boolean = false;
  newLeaveType: LeaveType = { ID: 0, CAPTION: '', CODE: '' };

  constructor(
    private leaveTypeService: LeaveTypeService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.leaveTypeService.getLeaveTypes().subscribe(
      (data) => {
        console.log(data);
        this.leaveTypes = data;
      },
      (error) => {
        console.error('Błąd podczas ładowania typów urlopów:', error);
        this.dialogService.showMessage('Błąd podczas ładowania typów urlopów:\n' + error?.message);
      }
    );
  }

  startEdit(leaveType: LeaveType): void {
    this.isEditing = true;
    this.editedLeaveType = { ...leaveType };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedLeaveType = null;
  }

  saveEdit(): void {
    if (this.editedLeaveType) {
      this.leaveTypeService.updateLeaveType(this.editedLeaveType).subscribe(
        (response) => {
          console.log('Zaktualizowano typ urlopu:', response);
          this.loadLeaveTypes();
          this.isEditing = false;
          this.editedLeaveType = null;
        },
        (error) => {
          console.error('Błąd podczas edytowania typu urlopu:', error);
          this.dialogService.showMessage('Błąd podczas edytowania typu urlopu:\n' + error?.message);
        }
      );
    }
  }

  deleteLeaveType(leaveTypeId: number): void {
    this.leaveTypeService.deleteLeaveType(leaveTypeId).subscribe(
      (response) => {
        console.log('Usunięto typ urlopu:', response);
        this.loadLeaveTypes();
      },
      (error) => {
        console.error('Błąd podczas usuwania typu urlopu:', error);
        this.dialogService.showMessage('Błąd podczas usuwania typu urlopu:\n' + error?.message);
      }
    );
  }

  addLeaveType(): void {
    this.isAdding = true;
    this.newLeaveType = { ID: 0, CAPTION: '', CODE: '' };
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.newLeaveType = { ID: 0, CAPTION: '', CODE: '' };
  }

  submitNewLeaveType(): void {
    this.leaveTypeService.addLeaveType(this.newLeaveType).subscribe(
      (response) => {
        console.log('Dodano nowy typ urlopu:', response);
        this.loadLeaveTypes();
        this.isAdding = false;
      },
      (error) => {
        console.error('Błąd podczas dodawania typu urlopu:', error);
        this.dialogService.showMessage('Błąd podczas dodawania typu urlopu:\n' + error?.message);
      }
    );
  }
}
