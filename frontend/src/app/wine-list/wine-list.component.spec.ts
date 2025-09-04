import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { WineListComponent } from './wine-list.component';
import { WineService } from '../wine.service';
import { Wine } from '../wine';

describe('WineListComponent', () => {
  let component: WineListComponent;
  let fixture: ComponentFixture<WineListComponent>;
  let mockWineService: jasmine.SpyObj<WineService>;

  const dummyWines: Wine[] = [
    { id: 1, name: 'Test Wine 1', year: 2020, type: 'Red', varietal: 'Test Varietal', rating: 90, description: 'Desc 1', imageUrl: '' },
    { id: 2, name: 'Test Wine 2', year: 2021, type: 'White', varietal: 'Test Varietal 2', rating: 95, description: 'Desc 2', imageUrl: '' }
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
