import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WineService } from '../../wine.service';
import { WineFormStateService } from '../../wine-form-state.service';
import { Wine } from '../../models/wine.model';

@Component({
  selector: 'app-wine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wine-form.component.html',
  styleUrls: ['./wine-form.component.css']
})
export class WineFormComponent implements OnInit {
  wineForm: FormGroup;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private wineService = inject(WineService);
  private router = inject(Router);
  private formStateService = inject(WineFormStateService);

  constructor() {
    this.wineForm = this.fb.group({
      name: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1800)]],
      winery: ['', Validators.required],
      region: ['', Validators.required],
      grapeVariety: ['', Validators.required],
      aroma: ['', Validators.required], // Handled as comma-separated string
      taste: ['', Validators.required], // Handled as comma-separated string
      foodPairing: ['', Validators.required], // Handled as comma-separated string
      alcoholPercentage: [12.5, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', Validators.required],
      price: [null],
      oakAging: this.fb.group({
        oakType: [null],
        durationMonths: [null]
      })
    });
  }

  ngOnInit(): void {
    const prefillData = this.formStateService.getAndClearWineData();
    if (prefillData) {
      // Convert arrays to comma-separated strings for the form
      const formData = {
        ...prefillData,
        aroma: prefillData.aroma?.join(', '),
        taste: prefillData.taste?.join(', '),
        foodPairing: prefillData.foodPairing?.join(', '),
      };
      this.wineForm.patchValue(formData);
    }
  }

  onSubmit(): void {
    if (this.wineForm.invalid) {
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    const formValue = this.wineForm.value;
    const newWine: Partial<Wine> = {
      ...formValue,
      aroma: formValue.aroma.split(',').map((s: string) => s.trim()),
      taste: formValue.taste.split(',').map((s: string) => s.trim()),
      foodPairing: formValue.foodPairing.split(',').map((s: string) => s.trim()),
    };

    this.wineService.createWine(newWine as Wine).subscribe({
      next: () => {
        this.router.navigate(['/']); // Navigate to home on success
      },
      error: (err) => {
        this.error = err.error.msg || 'Failed to create wine';
        console.error(err);
      }
    });
  }
}
