import { TestBed } from '@angular/core/testing';

import { BoniSpaService } from './boni-spa.service';

describe('BoniSpaService', () => {
  let service: BoniSpaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoniSpaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
