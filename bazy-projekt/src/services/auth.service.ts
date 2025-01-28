import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user?: User;

  constructor() {}

  // Zapisuje dane użytkownika po zalogowaniu
  setUser(user: User) {
    this.user = user;
  }

  // Pobiera dane użytkownika
  getUser() {
    return this.user;
  }

  // Sprawdza, czy użytkownik jest zalogowany
  isAuthenticated(): boolean {
    return this.user !== null;
  }

  // Wylogowanie użytkownika
  logout() {
    this.user = undefined;
  }
}
