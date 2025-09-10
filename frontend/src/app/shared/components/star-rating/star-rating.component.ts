import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  hoverRating: number = 0;

  rate(rating: number): void {
    if (!this.readonly) {
      this.rating = rating;
      this.ratingChange.emit(this.rating);
    }
  }

  onStarHover(rating: number): void {
    if (!this.readonly) {
      this.hoverRating = rating;
    }
  }

  onStarLeave(): void {
    if (!this.readonly) {
      this.hoverRating = 0;
    }
  }
}
