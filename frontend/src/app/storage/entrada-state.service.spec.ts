import { TestBed } from '@angular/core/testing';

import { EntradaStateService } from './entrada-state.service';

describe('EntradaStateService', () => {
  let service: EntradaStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
