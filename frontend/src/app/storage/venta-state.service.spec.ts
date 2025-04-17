import { TestBed } from '@angular/core/testing';

import { VentaStateService } from './venta-state.service';

describe('VentaStateService', () => {
  let service: VentaStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentaStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
