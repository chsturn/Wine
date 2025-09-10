import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Wine } from '../models/wine.model';
import { WineService } from '../wine.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wine-list.component.html',
  styleUrls: ['./wine-list.component.css']
})
export class WineListComponent implements OnInit {
  private wineService = inject(WineService);
  private authService = inject(AuthService);
  private router = inject(Router);
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

  editWine(id: string): void {
    // Navigate to a new edit page. The form component can be reused for editing.
    this.router.navigate(['/wines', id, 'edit']);
  }
}
