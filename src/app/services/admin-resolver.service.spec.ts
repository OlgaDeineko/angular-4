import { TestBed, inject } from '@angular/core/testing';

import { AdminResolverService } from './admin-resolver.service';

describe('AdminResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminResolverService]
    });
  });

  it('should be created', inject([AdminResolverService], (service: AdminResolverService) => {
    expect(service).toBeTruthy();
  }));
});
