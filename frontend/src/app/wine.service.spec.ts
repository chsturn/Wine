import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WineService } from './wine.service';
import { Wine } from './models/wine.model';

describe('WineService', () => {
  let service: WineService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WineService]
    });
    service = TestBed.inject(WineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch wines from the API via GET', () => {
    const dummyWines: Wine[] = [
      {
        _id: '1',
        name: 'Test Wine 1',
        year: 2020,
        winery: 'Test Winery',
        region: 'Test Region',
        grapeVariety: 'Test Grape',
        aroma: ['cherry', 'vanilla'],
        taste: ['bold', 'fruity'],
        foodPairing: ['beef', 'pasta'],
        alcoholPercentage: 14,
        description: 'A fine test wine.'
      },
      {
        _id: '2',
        name: 'Test Wine 2',
        year: 2021,
        winery: 'Test Winery 2',
        region: 'Test Region 2',
        grapeVariety: 'Test Grape 2',
        aroma: ['citrus', 'oak'],
        taste: ['crisp', 'dry'],
        foodPairing: ['chicken', 'salad'],
        alcoholPercentage: 12.5,
        description: 'Another excellent test wine.'
      }
    ];

    service.getWines().subscribe(wines => {
      expect(wines.length).toBe(2);
      expect(wines).toEqual(dummyWines);
    });

    const request = httpMock.expectOne('http://localhost:3000/api/wines');
    expect(request.request.method).toBe('GET');
    request.flush(dummyWines);
  });
});
