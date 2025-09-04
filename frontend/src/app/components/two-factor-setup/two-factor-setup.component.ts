import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service'; // This will need new methods

@Component({
  selector: 'app-two-factor-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor-setup.component.html',
  styleUrls: ['./two-factor-setup.component.css']
})
export class TwoFactorSetupComponent {
  private authService = inject(AuthService);

  qrCodeUrl = signal<string | null>(null);
  verificationToken = '';
  disablePassword = '';

  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Note: We would ideally get the user's 2FA status from a user profile endpoint.
  // For now, we'll just manage the setup flow.

  startSetup(): void {
    this.error.set(null);
    this.success.set(null);
    this.qrCodeUrl.set(null);
    // Assumes setup2FA exists on AuthService and returns an Observable<{ qrCodeUrl: string }>
    this.authService.setup2FA().subscribe({
      next: (res) => {
        this.qrCodeUrl.set(res.qrCodeUrl);
      },
      error: (err) => {
        this.error.set(err.error.msg || 'Failed to start 2FA setup');
      }
    });
  }

  verifyAndEnable(): void {
    if (!this.verificationToken) {
      this.error.set('Please enter the token from your authenticator app.');
      return;
    }
    // Assumes verify2FA exists on AuthService
    this.authService.verify2FA(this.verificationToken).subscribe({
      next: (res) => {
        this.success.set(res.msg);
        this.qrCodeUrl.set(null); // Hide QR code on success
        this.error.set(null);
        // Here you might want to update a user profile state
      },
      error: (err) => {
        this.error.set(err.error.msg || 'Invalid token');
      }
    });
  }

  disable(): void {
    if (!this.disablePassword) {
      this.error.set('Please enter your password to disable 2FA.');
      return;
    }
    // Assumes disable2FA exists on AuthService
    this.authService.disable2FA(this.disablePassword).subscribe({
      next: (res) => {
        this.success.set(res.msg);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set(err.error.msg || 'Failed to disable 2FA');
      }
    });
  }
}
