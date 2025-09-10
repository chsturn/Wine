import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { WineListComponent } from './wine-list.component';
import { WineService } from '../wine.service';
import { Wine } from '../models/wine.model'; // Updated import path

describe('WineListComponent', () => {
  let component: WineListComponent;
  let fixture: ComponentFixture<WineListComponent>;
  let mockWineService: jasmine.SpyObj<WineService>;

  // Updated dummy data to match the new model
  const dummyWines: Wine[] = [
    {
      _id: '1',
      name: 'Test Wine 1',
      year: 2020,
      winery: 'Test Winery',
      region: 'Test Region',
      grapeVariety: 'Test Grape',
      aroma: ['cherry', 'vanilla'],
      taste: ['full-bodied'],
      foodPairing: ['steak'],
      alcoholPercentage: 14,
      description: 'A test wine.'
    },
    {
      _id: '2',
      name: 'Test Wine 2',
      year: 2021,
      winery: 'Another Winery',
      region: 'Another Region',
      grapeVariety: 'Another Grape',
      aroma: ['citrus'],
      taste: ['crisp'],
      foodPairing: ['fish'],
      alcoholPercentage: 12.5,
      description: 'Another test wine.'
    }
  ];

  beforeEach(async () => {
    mockWineService = jasmine.createSpyObj('WineService', ['getWines']);

    await TestBed.configureTestingModule({
      imports: [WineListComponent],
      providers: [
        { provide: WineService, useValue: mockWineService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WineListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch wines and update signal on init', fakeAsync(() => {
    mockWineService.getWines.and.returnValue(of(dummyWines));

    fixture.detectChanges(); // ngOnInit() is called
    tick(); // Wait for the observable to resolve

    expect(component.wines().length).toBe(2);
    expect(component.wines()).toEqual(dummyWines);
    expect(component.error()).toBeNull();
  }));

  it('should set error signal when fetching wines fails', fakeAsync(() => {
    mockWineService.getWines.and.returnValue(throwError(() => new Error('Failed to fetch')));

    fixture.detectChanges(); // ngOnInit() is called
    tick(); // Wait for the observable to resolve

    expect(component.wines().length).toBe(0);
    expect(component.error()).not.toBeNull();
    expect(component.error()).toContain('Failed to load wines');
  }));
});
