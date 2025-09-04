import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wine } from './models/wine.model'; // Updated path
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WineService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/wines';

  getWines(): Observable<Wine[]> {
    return this.http.get<Wine[]>(this.apiUrl);
  }

  createWine(wine: Wine): Observable<Wine> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authService.getToken() || ''
    });
    return this.http.post<Wine>(this.apiUrl, wine, { headers });
  }
}
