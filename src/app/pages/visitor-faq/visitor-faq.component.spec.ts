import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorFaqComponent } from './visitor-faq.component';

describe('VisitorFaqComponent', () => {
  let component: VisitorFaqComponent;
  let fixture: ComponentFixture<VisitorFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
