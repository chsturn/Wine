import { Component, OnInit, inject, signal, WritableSignal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WineService } from '../../core/services/wine.service';
import { AuthService } from '../../core/services/auth.service';
import { Wine } from '../../shared/models/wine.model';
import { MapComponent } from '../../shared/components/map/map.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-wine-detail',
  standalone: true,
  imports: [CommonModule, MapComponent, StarRatingComponent],
  templateUrl: './wine-detail.component.html',
  styleUrls: ['./wine-detail.component.css']
})
export class WineDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private wineService = inject(WineService);
  private authService = inject(AuthService);

  wine = signal<Wine | null>(null);
  nearbyWines: WritableSignal<Wine[]> = signal([]);
  error = signal<string | null>(null);

  userRating = computed(() => this.wine()?.userRating || 0);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const wineId = params.get('id');
        if (wineId) {
          return this.wineService.getWineById(wineId);
        }
        throw new Error('Wine ID not found');
      }),
      switchMap(wine => {
        this.wine.set(wine);
        if (wine.location) {
          const [lon, lat] = wine.location.coordinates;
          return this.wineService.getWinesNearby(lat, lon, 20000);
        }
        return [];
      })
    ).subscribe({
      next: (nearby) => this.nearbyWines.set(nearby),
      error: (err) => {
        this.error.set(err.error.msg || 'Failed to load wine details or nearby wines.');
        console.error(err);
      }
    });
  }

  loadWineDetails(): void {
    const wineId = this.wine()?._id;
    if (wineId) {
      this.wineService.getWineById(wineId).subscribe({
        next: (wine) => this.wine.set(wine),
        error: (err) => {
          this.error.set(err.error.msg || 'Failed to reload wine details.');
          console.error(err);
        }
      });
    }
  }

  onRatingChange(rating: number): void {
    const wineId = this.wine()?._id;
    if (wineId) {
      this.wineService.rateWine(wineId, rating).subscribe({
        next: () => {
          // After rating, reload the wine details to get the updated average
          this.loadWineDetails();
        },
        error: (err) => {
          this.error.set(err.error.msg || 'Failed to submit rating.');
          console.error(err);
        }
      });
    }
  }
}
