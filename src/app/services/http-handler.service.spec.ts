import { TestBed, inject } from '@angular/core/testing';

import { HttpHandlerService } from './http-handler.service';

describe('HttpHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpHandlerService]
    });
  });

  it('should be created', inject([HttpHandlerService], (service: HttpHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
