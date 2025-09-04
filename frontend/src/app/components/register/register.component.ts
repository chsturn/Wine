import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  error: string | null = null;
  success: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  register(): void {
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }
    this.authService.register({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.success = res.msg + '. You can now log in.';
        this.error = null;
        // Optionally, redirect to login after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error.msg || 'Registration failed';
        this.success = null;
        console.error(err);
      }
    });
  }
}
