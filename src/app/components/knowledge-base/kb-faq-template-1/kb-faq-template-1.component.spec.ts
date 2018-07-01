import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KbFaqTemplate1Component } from './kb-faq-template-1.component';

describe('KbFaqTemplate1Component', () => {
  let component: KbFaqTemplate1Component;
  let fixture: ComponentFixture<KbFaqTemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KbFaqTemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KbFaqTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
