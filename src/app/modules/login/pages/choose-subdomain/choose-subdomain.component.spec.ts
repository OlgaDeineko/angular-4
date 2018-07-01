import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubdomainComponent } from './choose-subdomain.component';

describe('ChooseSubdomainComponent', () => {
  let component: ChooseSubdomainComponent;
  let fixture: ComponentFixture<ChooseSubdomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubdomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubdomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
