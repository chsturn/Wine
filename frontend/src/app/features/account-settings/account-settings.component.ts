import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  passwordForm: FormGroup;

  // 2FA properties
  qrCodeUrl = signal<string | null>(null);
  verificationToken = '';
  disablePassword = '';

  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor() {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      firstname: [''],
      lastname: [''],
      birthdate: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Assumes getProfile exists on AuthService
    this.authService.getProfile().subscribe(user => {
      // Format date for the input field
      const birthdate = user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '';
      this.profileForm.patchValue({ ...user, birthdate });
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => this.success.set('Profile updated successfully.'),
      error: (err) => this.error.set(err.error.msg || 'Failed to update profile')
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.success.set('Password changed successfully.');
        this.passwordForm.reset();
      },
      error: (err) => this.error.set(err.error.msg || 'Failed to change password')
    });
  }

  // --- 2FA Methods (copied and adapted) ---
  start2FASetup(): void {
    this.error.set(null);
    this.success.set(null);
    this.qrCodeUrl.set(null);
    this.authService.setup2FA().subscribe({
      next: (res) => this.qrCodeUrl.set(res.qrCodeUrl),
      error: (err) => this.error.set(err.error.msg || 'Failed to start 2FA setup')
    });
  }

  verifyAndEnable2FA(): void {
    if (!this.verificationToken) return;
    this.authService.verify2FA(this.verificationToken).subscribe({
      next: (res) => {
        this.success.set(res.msg);
        this.qrCodeUrl.set(null);
        this.error.set(null);
      },
      error: (err) => this.error.set(err.error.msg || 'Invalid token')
    });
  }

  disable2FA(): void {
    if (!this.disablePassword) return;
    this.authService.disable2FA(this.disablePassword).subscribe({
      next: (res) => {
        this.success.set(res.msg);
        this.error.set(null);
      },
      error: (err) => this.error.set(err.error.msg || 'Failed to disable 2FA')
    });
  }
}
