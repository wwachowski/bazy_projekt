import { Component, OnInit } from '@angular/core';
import { LeaveApplicationAction } from '../../models/leave-application-action.model';
import { LeaveApplicationActionService } from '../../services/api/leave-application-action.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-leave-application-actions',
  templateUrl: './leave-application-actions.component.html',
  styleUrls: ['./leave-application-actions.component.css'],
  standalone: false,
})
export class LeaveApplicationActionsComponent implements OnInit {
  actions: LeaveApplicationAction[] = [];
  isEditing: boolean = false;
  editedAction: LeaveApplicationAction | null = null;
  isAdding: boolean = false;
  newAction: LeaveApplicationAction = {
    ID: 0,
    SOURCE_STATUS_ID: 0,
    DESTINATION_STATUS_ID: 0,
    NAME: '',
    COLOR: '',
    ACTION_INDEX: 0,
    DESCRIPTION: '',
    AVAILABILITY_ROLE: 'ALL',
  };

  constructor(
    private actionService: LeaveApplicationActionService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadActions();
  }

  loadActions(): void {
    this.actionService.getActions().subscribe(
      (data) => {
        console.log(data);
        this.actions = data;
      },
      (error) => {
        console.error('Błąd podczas ładowania akcji:', error);
        this.dialogService.showMessage('Błąd podczas ładowania akcji:\n' + error?.message);
      }
    );
  }

  startEdit(action: LeaveApplicationAction): void {
    this.isEditing = true;
    this.editedAction = { ...action };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedAction = null;
  }

  saveEdit(): void {
    if (this.editedAction) {
      this.actionService.updateAction(this.editedAction).subscribe(
        () => {
          console.log('Zaktualizowano akcję');
          this.loadActions();
          this.isEditing = false;
          this.editedAction = null;
        },
        (error) => {
          console.error('Błąd podczas edytowania akcji:', error);
          this.dialogService.showMessage('Błąd podczas edytowania akcji:\n' + error?.message);
        }
      );
    }
  }

  deleteAction(actionId: number): void {
    this.actionService.deleteAction(actionId).subscribe(
      () => {
        console.log('Usunięto akcję');
        this.loadActions();
      },
      (error) => {
        console.error('Błąd podczas usuwania akcji:', error);
        this.dialogService.showMessage('Błąd podczas usuwania akcji:\n' + error?.message);
      }
    );
  }

  addAction(): void {
    this.isAdding = true;
    this.newAction = {
      ID: 0,
      SOURCE_STATUS_ID: 0,
      DESTINATION_STATUS_ID: 0,
      NAME: '',
      COLOR: '',
      ACTION_INDEX: 0,
      DESCRIPTION: '',
      AVAILABILITY_ROLE: 'ALL',
    };
  }

  cancelAdd(): void {
    this.isAdding = false;
  }

  submitNewAction(): void {
    this.actionService.addAction(this.newAction).subscribe(
      () => {
        console.log('Dodano nową akcję');
        this.loadActions();
        this.isAdding = false;
      },
      (error) => {
        console.error('Błąd podczas dodawania akcji:', error);
        this.dialogService.showMessage('Błąd podczas dodawania akcji:\n' + error?.message);
      }
    );
  }
}
