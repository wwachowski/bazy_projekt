// src/app/components/dialog/dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: false,
})
export class DialogComponent implements OnInit {
  message: string = '';  // Przechowujemy aktualny komunikat

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    // Subskrybujemy serwis, by odbierać komunikaty
    this.dialogService.message$.subscribe((message) => {
      this.message = message;
      setTimeout(() => {
        this.message = '';  // Resetujemy komunikat po 5 sekundach
      }, 5000);
    });
  }
}
