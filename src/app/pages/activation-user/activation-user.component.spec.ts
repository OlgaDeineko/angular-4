import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationUserComponent } from './activation-user.component';

describe('ActivationUserComponent', () => {
  let component: ActivationUserComponent;
  let fixture: ComponentFixture<ActivationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
