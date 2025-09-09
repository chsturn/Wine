import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WineService } from '../../wine.service';
import { Wine } from '../../models/wine.model';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-wine-detail',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './wine-detail.component.html',
  styleUrls: ['./wine-detail.component.css']
})
export class WineDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private wineService = inject(WineService);

  wine = signal<Wine | null>(null);
  nearbyWines: WritableSignal<Wine[]> = signal([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const wineId = this.route.snapshot.paramMap.get('id');
    if (wineId) {
      this.wineService.getWineById(wineId).pipe(
        switchMap(wine => {
          this.wine.set(wine);
          if (wine.location) {
            const [lon, lat] = wine.location.coordinates;
            // Fetch wines within a 20km radius
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
  }
}
