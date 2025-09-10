import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-average-rating',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './average-rating.component.html',
  styleUrls: ['./average-rating.component.css']
})
export class AverageRatingComponent {
  @Input() averageRating: number = 0;
  @Input() ratingsCount: number = 0;
}
