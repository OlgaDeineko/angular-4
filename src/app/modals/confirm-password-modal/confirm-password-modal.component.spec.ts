import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPasswordModalComponent } from './confirm-password-modal.component';

describe('ConfirmPasswordModalComponent', () => {
  let component: ConfirmPasswordModalComponent;
  let fixture: ComponentFixture<ConfirmPasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
