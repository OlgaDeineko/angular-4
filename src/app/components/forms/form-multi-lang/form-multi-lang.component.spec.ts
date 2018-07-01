import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMultiLangComponent } from './form-multi-lang.component';

describe('FormMultiLangComponent', () => {
  let component: FormMultiLangComponent;
  let fixture: ComponentFixture<FormMultiLangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMultiLangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMultiLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
