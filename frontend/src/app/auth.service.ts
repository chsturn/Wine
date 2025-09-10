import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from './models/user.model';
import { AuthResponse } from './models/auth-response.model';

interface LoginResponse extends AuthResponse {
  tfa_required?: boolean;
  tfa_token?: string;
}

interface DecodedToken {
  user: {
    id: string;
    role: string;
  };
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private http = inject(HttpClient);

  private token = signal<string | null>(localStorage.getItem('token'));
  private tfaToken = signal<string | null>(null);
  userRole = computed(() => this.getRoleFromToken(this.token()));

  isLoggedIn = computed(() => this.token() !== null);
  isAdmin = computed(() => this.userRole() === 'Admin');
  isEditor = computed(() => this.userRole() === 'Editor' || this.userRole() === 'Admin');

  constructor() {
    effect(() => {
      const currentToken = this.token();
      if (currentToken) {
        localStorage.setItem('token', currentToken);
      } else {
        localStorage.removeItem('token');
      }
    });
  }

  private getRoleFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.user.role;
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ 'x-auth-token': this.getToken() || '' });
  }

  register(user: User): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/register`, user);
  }

  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        if (response.tfa_required && response.tfa_token) {
          this.tfaToken.set(response.tfa_token);
        } else if (response.token) {
          this.token.set(response.token);
        }
      })
    );
  }

  loginWith2FA(tfaCode: string): Observable<AuthResponse> {
    const tempToken = this.tfaToken();
    if (!tempToken) {
      throw new Error('No temporary 2FA token found');
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/2fa/login`, { tfa_token: tempToken, token: tfaCode }).pipe(
      tap(response => {
        this.token.set(response.token);
        this.tfaToken.set(null);
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.tfaToken.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  setup2FA(): Observable<{ qrCodeUrl: string }> {
    return this.http.post<{ qrCodeUrl: string }>(`${this.apiUrl}/2fa/setup`, {}, { headers: this.getAuthHeaders() });
  }

  verify2FA(token: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/2fa/verify`, { token }, { headers: this.getAuthHeaders() });
  }

  disable2FA(password: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/2fa/disable`, { password }, { headers: this.getAuthHeaders() });
  }

  // --- Profile Management Methods ---

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, profileData, { headers: this.getAuthHeaders() });
  }

  changePassword(passwordData: any): Observable<{ msg: string }> {
    return this.http.put<{ msg: string }>(`${this.apiUrl}/change-password`, passwordData, { headers: this.getAuthHeaders() });
  }
}
