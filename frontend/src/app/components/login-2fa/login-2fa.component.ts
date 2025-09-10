import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-2fa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-2fa.component.html',
  styleUrls: ['./login-2fa.component.css']
})
export class Login2faComponent {
  token = '';
  error: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  verify(): void {
    if (!this.token) {
      this.error = 'Please enter your 2FA token.';
      return;
    }
    // Assumes loginWith2FA exists on AuthService
    this.authService.loginWith2FA(this.token).subscribe({
      next: () => {
        this.router.navigate(['/']); // Navigate to home on success
      },
      error: (err) => {
        this.error = err.error.msg || 'Login failed';
        console.error(err);
      }
    });
  }
}
