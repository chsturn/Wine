import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wine } from '../wine';
import { WineService } from '../wine.service';

@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wine-list.component.html',
  styleUrls: ['./wine-list.component.css']
})
export class WineListComponent implements OnInit {
  private wineService = inject(WineService);
  public wines: WritableSignal<Wine[]> = signal([]);
  public error: WritableSignal<string | null> = signal(null);

  ngOnInit(): void {
    this.wineService.getWines().subscribe({
      next: (data) => this.wines.set(data),
      error: (err) => {
        console.error('Error fetching wines', err);
        this.error.set('Failed to load wines. Is the backend server running?');
      }
    });
  }
}
