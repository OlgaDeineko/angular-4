import { TestBed, async, inject } from '@angular/core/testing';

import { AccessibilityGuard } from './accessibility.guard';

describe('AccessibilityGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessibilityGuard]
    });
  });

  it('should ...', inject([AccessibilityGuard], (guard: AccessibilityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
