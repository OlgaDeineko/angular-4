import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectingComponent } from './redirecting.component';

describe('RedirectingComponent', () => {
  let component: RedirectingComponent;
  let fixture: ComponentFixture<RedirectingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
