import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from './models/user.model';
import { AuthResponse } from './models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private http = inject(HttpClient);

  // Signal to hold the token from localStorage
  private token = signal<string | null>(localStorage.getItem('token'));

  // Computed signal for logged-in status
  isLoggedIn = computed(() => this.token() !== null);

  constructor() {
    // Effect to update local storage when the token signal changes
    effect(() => {
      const currentToken = this.token();
      if (currentToken) {
        localStorage.setItem('token', currentToken);
      } else {
        localStorage.removeItem('token');
      }
    });
  }

  register(user: User): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/register`, user);
  }

  login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        this.token.set(response.token);
      })
    );
  }

  logout(): void {
    this.token.set(null);
  }

  getToken(): string | null {
    return this.token();
  }
}
