import { TestBed, inject } from '@angular/core/testing';

import { TreeTranslateService } from './tree-translate.service';

describe('TreeTranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeTranslateService]
    });
  });

  it('should be created', inject([TreeTranslateService], (service: TreeTranslateService) => {
    expect(service).toBeTruthy();
  }));
});
