import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateUserModalComponent } from './activate-user-modal.component';

describe('ActivateUserModalComponent', () => {
  let component: ActivateUserModalComponent;
  let fixture: ComponentFixture<ActivateUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
