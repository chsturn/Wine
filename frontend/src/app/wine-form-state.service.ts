import { Injectable, signal } from '@angular/core';
import { Wine } from './models/wine.model';

@Injectable({
  providedIn: 'root'
})
export class WineFormStateService {
  private wineDataSource = signal<Partial<Wine> | null>(null);

  // A public readonly signal for components that should not modify the state directly.
  public readonly wineData = this.wineDataSource.asReadonly();

  /**
   * Sets the wine data to be used for pre-populating the form.
   * @param data The partial wine data from the AI analysis.
   */
  setWineData(data: Partial<Wine>): void {
    this.wineDataSource.set(data);
  }

  /**
   * Retrieves the wine data and immediately clears it to prevent reuse.
   * This should be called by the form component on initialization.
   * @returns The partial wine data, or null if none exists.
   */
  getAndClearWineData(): Partial<Wine> | null {
    const data = this.wineData();
    this.wineDataSource.set(null); // Clear the data after it has been retrieved
    return data;
  }
}
