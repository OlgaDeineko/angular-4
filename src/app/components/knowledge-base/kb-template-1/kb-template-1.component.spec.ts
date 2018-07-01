import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KbTemplate1Component } from './kb-template-1.component';

describe('KbTemplate1Component', () => {
  let component: KbTemplate1Component;
  let fixture: ComponentFixture<KbTemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KbTemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KbTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
