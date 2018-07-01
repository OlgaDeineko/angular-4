import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubdomainModalComponent } from './choose-subdomain-modal.component';

describe('ChooseSubdomainModalComponent', () => {
  let component: ChooseSubdomainModalComponent;
  let fixture: ComponentFixture<ChooseSubdomainModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubdomainModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubdomainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
