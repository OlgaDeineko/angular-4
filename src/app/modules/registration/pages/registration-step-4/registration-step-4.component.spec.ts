import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStep4Component } from './registration-step-4.component';

describe('RegistrationStep4Component', () => {
  let component: RegistrationStep4Component;
  let fixture: ComponentFixture<RegistrationStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
