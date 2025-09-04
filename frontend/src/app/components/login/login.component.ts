import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

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
