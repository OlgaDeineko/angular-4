import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KbFaqTemplate0Component } from './kb-faq-template-0.component';

describe('KbFaqTemplate0Component', () => {
  let component: KbFaqTemplate0Component;
  let fixture: ComponentFixture<KbFaqTemplate0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KbFaqTemplate0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KbFaqTemplate0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
