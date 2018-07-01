import { TestBed, async, inject } from '@angular/core/testing';

import { NotExistSubdomainGuard } from './not-exist-subdomain.guard';

describe('NotExistSubdomainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotExistSubdomainGuard]
    });
  });

  it('should ...', inject([NotExistSubdomainGuard], (guard: NotExistSubdomainGuard) => {
    expect(guard).toBeTruthy();
  }));
});
