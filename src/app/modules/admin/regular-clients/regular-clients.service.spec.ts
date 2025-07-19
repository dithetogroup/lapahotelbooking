import { TestBed } from '@angular/core/testing';

import { RegularClientsService } from './regular-clients.service';

describe('RegularClientsService', () => {
  let service: RegularClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegularClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
