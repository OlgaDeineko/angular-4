import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSubdomainForSuperadminComponent } from './choose-subdomain-for-superadmin.component';

describe('ChooseSubdomainForSuperadminComponent', () => {
  let component: ChooseSubdomainForSuperadminComponent;
  let fixture: ComponentFixture<ChooseSubdomainForSuperadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSubdomainForSuperadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSubdomainForSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
