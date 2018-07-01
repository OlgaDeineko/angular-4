import { TestBed, inject } from '@angular/core/testing';

import { TreeUntranslateService } from './tree-untranslate.service';

describe('TreeUntranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeUntranslateService]
    });
  });

  it('should be created', inject([TreeUntranslateService], (service: TreeUntranslateService) => {
    expect(service).toBeTruthy();
  }));
});
