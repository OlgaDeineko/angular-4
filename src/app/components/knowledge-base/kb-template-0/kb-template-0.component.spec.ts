import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KbTemplate0Component } from './kb-template-0.component';

describe('KbTemplate0Component', () => {
  let component: KbTemplate0Component;
  let fixture: ComponentFixture<KbTemplate0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KbTemplate0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KbTemplate0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
