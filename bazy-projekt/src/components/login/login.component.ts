import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model'; // Import modelu użytkownika

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Wstrzyknięcie serwisu
  ) {
  }

  onSubmit() {
    const credentials = { email: this.email, password: this.password };

    this.http.post('http://localhost:3000/api/login', credentials).subscribe(
      (response: any) => {
        if (response.success) {
          // Tworzymy obiekt użytkownika na podstawie odpowiedzi serwera
          const user = new User(
            response.user.id,
            response.user.first_name,
            response.user.last_name,
            response.user.email,
            response.user.user_type
          );

          console.log(user);

          // Zapisz użytkownika w serwisie
          this.authService.setUser(user);

          // Przekieruj na dashboard
          this.router.navigate(['/dashboard']);
        } else {
          alert('Nieprawidłowe dane logowania');
        }
      },
      (error) => {
        console.error('Błąd logowania', error);
      }
    );
  }
}
