import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationAppComponent } from './registration-app.component';

describe('RegistrationAppComponent', () => {
  let component: RegistrationAppComponent;
  let fixture: ComponentFixture<RegistrationAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
