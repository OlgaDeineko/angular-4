import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormColorPickerComponent } from './form-color-picker.component';

describe('FormColorPickerComponent', () => {
  let component: FormColorPickerComponent;
  let fixture: ComponentFixture<FormColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
