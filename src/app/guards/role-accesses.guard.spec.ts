import { TestBed, async, inject } from '@angular/core/testing';

import { RoleAccessesGuard } from './role-accesses.guard';

describe('RoleAccessesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleAccessesGuard]
    });
  });

  it('should ...', inject([RoleAccessesGuard], (guard: RoleAccessesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
