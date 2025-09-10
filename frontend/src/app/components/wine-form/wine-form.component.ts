import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WineService } from '../../wine.service';
import { WineFormStateService } from '../../wine-form-state.service';
import { Wine } from '../../models/wine.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  isEditMode = false;
  private currentWineId: string | null = null;

  private fb = inject(FormBuilder);
  private wineService = inject(WineService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formStateService = inject(WineFormStateService);

  constructor() {
    this.wineForm = this.fb.group({
      name: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1800)]],
      winery: ['', Validators.required],
      region: ['', Validators.required],
      grapeVariety: ['', Validators.required],
      aroma: ['', Validators.required],
      taste: ['', Validators.required],
      foodPairing: ['', Validators.required],
      alcoholPercentage: [12.5, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', Validators.required],
      price: [null],
      location: this.fb.group({
        longitude: [null, [Validators.min(-180), Validators.max(180)]],
        latitude: [null, [Validators.min(-90), Validators.max(90)]]
      }),
      oakAging: this.fb.group({
        oakType: [null],
        durationMonths: [null]
      })
    });
  }

  ngOnInit(): void {
    const prefillData = this.formStateService.getAndClearWineData();
    if (prefillData) {
      this.patchForm(prefillData);
    } else {
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.currentWineId = id;
            return this.wineService.getWineById(id);
          }
          return of(null);
        })
      ).subscribe(wine => {
        if (wine) {
          this.patchForm(wine);
        }
      });
    }
  }

  private patchForm(data: Partial<Wine>): void {
    const formData = {
      ...data,
      aroma: data.aroma?.join(', '),
      taste: data.taste?.join(', '),
      foodPairing: data.foodPairing?.join(', '),
      location: {
        longitude: data.location?.coordinates[0],
        latitude: data.location?.coordinates[1]
      }
    };
    this.wineForm.patchValue(formData);
  }

  onSubmit(): void {
    if (this.wineForm.invalid) {
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    const formValue = this.wineForm.value;
    const wineData: Partial<Wine> = {
      ...formValue,
      aroma: formValue.aroma.split(',').map((s: string) => s.trim()),
      taste: formValue.taste.split(',').map((s: string) => s.trim()),
      foodPairing: formValue.foodPairing.split(',').map((s: string) => s.trim()),
      location: {
        type: 'Point',
        coordinates: [formValue.location.longitude, formValue.location.latitude]
      }
    };

    const operation = this.isEditMode
      ? this.wineService.updateWine(this.currentWineId!, wineData)
      : this.wineService.createWine(wineData as Wine);

    operation.subscribe({
      next: (wine) => {
        this.router.navigate(['/wines', wine._id]); // Navigate to detail page on success
      },
      error: (err) => {
        this.error = err.error.msg || `Failed to ${this.isEditMode ? 'update' : 'create'} wine`;
        console.error(err);
      }
    });
  }
}
