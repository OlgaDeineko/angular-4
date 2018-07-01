import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqStatusesSidebarComponent } from './faq-statuses-sidebar.component';

describe('FaqStatusesSidebarComponent', () => {
  let component: FaqStatusesSidebarComponent;
  let fixture: ComponentFixture<FaqStatusesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqStatusesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqStatusesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
