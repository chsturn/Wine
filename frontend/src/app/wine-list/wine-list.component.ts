import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wine } from '../models/wine.model';
import { WineService } from '../wine.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wine-list.component.html',
  styleUrls: ['./wine-list.component.css']
})
export class WineListComponent implements OnInit {
  private wineService = inject(WineService);
  private authService = inject(AuthService);
  public wines: WritableSignal<Wine[]> = signal([]);
  public error: WritableSignal<string | null> = signal(null);

  isEditor = this.authService.isEditor;

  ngOnInit(): void {
    this.loadWines();
  }

  loadWines(): void {
    this.wineService.getWines().subscribe({
      next: (data) => this.wines.set(data),
      error: (err) => {
        console.error('Error fetching wines', err);
        this.error.set('Failed to load wines. Is the backend server running?');
      }
    });
  }

  deleteWine(id: string): void {
    if (confirm('Are you sure you want to delete this wine?')) {
      // Assumes deleteWine exists on WineService
      this.wineService.deleteWine(id).subscribe({
        next: () => {
          this.loadWines(); // Refresh the list after deleting
        },
        error: (err) => {
          this.error.set(err.error.msg || 'Failed to delete wine');
          console.error(err);
        }
      });
    }
  }
}
