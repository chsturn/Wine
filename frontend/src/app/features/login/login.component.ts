import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  login(): void {
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        if (response.tfa_required) {
          // Navigate to the 2FA verification page
          this.router.navigate(['/login/2fa']);
        } else {
          // Navigate to home on successful login without 2FA
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.error = err.error.msg || 'Login failed';
        console.error(err);
      }
    });
  }
}
