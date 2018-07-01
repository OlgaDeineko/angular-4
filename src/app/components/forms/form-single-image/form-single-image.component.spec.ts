import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSingleImageComponent } from './form-single-image.component';

describe('FormSingleImageComponent', () => {
  let component: FormSingleImageComponent;
  let fixture: ComponentFixture<FormSingleImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSingleImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSingleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
