import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wine } from '../../shared/models/wine.model'; // Updated path
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

  getWineById(id: string): Observable<Wine> {
    return this.http.get<Wine>(`${this.apiUrl}/${id}`);
  }

  private aiApiUrl = 'http://localhost:8001';

  createWine(wine: Wine): Observable<Wine> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authService.getToken() || ''
    });
    return this.http.post<Wine>(this.apiUrl, wine, { headers });
  }

  analyzeLabel(file: File): Observable<Partial<Wine>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'x-auth-token': this.authService.getToken() || ''
    });

    return this.http.post<Partial<Wine>>(`${this.aiApiUrl}/analyze-label`, formData, { headers });
  }

  deleteWine(id: string): Observable<{ msg: string }> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authService.getToken() || ''
    });
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`, { headers });
  }

  private geoApiUrl = 'http://localhost:3000/api/geo';

  updateWine(id: string, wine: Partial<Wine>): Observable<Wine> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authService.getToken() || ''
    });
    return this.http.put<Wine>(`${this.apiUrl}/${id}`, wine, { headers });
  }

  getWinesNearby(lat: number, lon: number, dist: number = 10000): Observable<Wine[]> {
    return this.http.get<Wine[]>(`${this.geoApiUrl}/nearby?lat=${lat}&lon=${lon}&dist=${dist}`);
  }

  getWinesWithinBounds(bounds: any): Observable<Wine[]> {
    const params = {
        sw_lon: bounds.getSouthWest().lng,
        sw_lat: bounds.getSouthWest().lat,
        ne_lon: bounds.getNorthEast().lng,
        ne_lat: bounds.getNorthEast().lat
    };
    return this.http.get<Wine[]>(`${this.geoApiUrl}/within-bounds`, { params });
  }
}
