import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WineService } from '../../core/services/wine.service';
import { WineFormStateService } from '../../core/services/wine-form-state.service';

@Component({
  selector: 'app-label-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label-upload.component.html',
  styleUrls: ['./label-upload.component.css']
})
export class LabelUploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  error = signal<string | null>(null);
  isLoading = signal(false);

  private wineService = inject(WineService);
  private formStateService = inject(WineFormStateService);
  private router = inject(Router);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.error.set(null);

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.error.set('Please select a file to upload.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.wineService.analyzeLabel(this.selectedFile).subscribe({
      next: (wineData) => {
        this.isLoading.set(false);
        this.formStateService.setWineData(wineData);
        this.router.navigate(['/wines/new']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.error.msg || 'Failed to analyze label.');
        console.error(err);
      }
    });
  }
}
