import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckboxGroupComponent } from './form-checkbox-group.component';

describe('FormCheckboxGroupComponent', () => {
  let component: FormCheckboxGroupComponent;
  let fixture: ComponentFixture<FormCheckboxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCheckboxGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
