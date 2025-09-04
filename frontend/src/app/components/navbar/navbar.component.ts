import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Expose the signal directly to the template
  isLoggedIn = this.authService.isLoggedIn;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
