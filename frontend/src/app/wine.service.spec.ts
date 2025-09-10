import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WineService } from './wine.service';
import { Wine } from './wine';

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
      { id: 1, name: 'Test Wine 1', year: 2020, type: 'Red', varietal: 'Test Varietal', rating: 90, description: 'Desc 1', imageUrl: '' },
      { id: 2, name: 'Test Wine 2', year: 2021, type: 'White', varietal: 'Test Varietal 2', rating: 95, description: 'Desc 2', imageUrl: '' }
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
