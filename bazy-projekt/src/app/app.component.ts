import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) {}
  // Funkcja przekierowująca na dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
