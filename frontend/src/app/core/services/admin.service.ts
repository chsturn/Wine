import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model'; // We'll need a more detailed User model for this view

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private adminApiUrl = 'http://localhost:3000/api/admin';

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-auth-token': this.authService.getToken() || ''
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminApiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  updateUserRole(userId: string, role: string): Observable<User> {
    return this.http.put<User>(`${this.adminApiUrl}/users/${userId}`, { role }, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.adminApiUrl}/users/${userId}`, { headers: this.getAuthHeaders() });
  }
}
