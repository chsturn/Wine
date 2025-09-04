import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WineListComponent } from './wine-list/wine-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WineListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Wine App';
}
