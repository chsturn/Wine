import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WineService } from '../../core/services/wine.service';
import { Wine } from '../../shared/models/wine.model';
import { MapComponent } from '../../shared/components/map/map.component';

@Component({
  selector: 'app-nearby-wineries',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './nearby-wineries.component.html',
  styleUrls: ['./nearby-wineries.component.css']
})
export class NearbyWineriesComponent implements OnInit {
  private wineService = inject(WineService);

  wineries: WritableSignal<Wine[]> = signal([]);
  error = signal<string | null>(null);

  // Default to a central location if geolocation fails or is denied
  initialLat: number = 47.3769;
  initialLon: number = 8.5417;

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.initialLat = position.coords.latitude;
          this.initialLon = position.coords.longitude;
          this.loadInitialWineries();
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.error.set('Could not get your location. Showing default map.');
          this.loadInitialWineries();
        }
      );
    } else {
      this.error.set('Geolocation is not supported by your browser. Showing default map.');
      this.loadInitialWineries();
    }
  }

  loadInitialWineries(): void {
    // Load wineries within 100km of the initial point
    this.wineService.getWinesNearby(this.initialLat, this.initialLon, 100000).subscribe({
      next: (data) => this.wineries.set(data),
      error: (err) => this.error.set(err.error.msg || 'Failed to load wineries.')
    });
  }

  onMapBoundsChange(bounds: any): void {
    this.wineService.getWinesWithinBounds(bounds).subscribe({
        next: (data) => {
            // Here we could merge the new wineries with existing ones,
            // but for simplicity, we'll just replace them.
            this.wineries.set(data);
        },
        error: (err) => {
            // Don't show a blocking error, just log it,
            // as this happens on every map move.
            console.error('Failed to load wineries for new bounds:', err);
        }
    });
  }
}
