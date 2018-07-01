import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqStatusComponent } from './faq-status.component';

describe('FaqStatusComponent', () => {
  let component: FaqStatusComponent;
  let fixture: ComponentFixture<FaqStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
