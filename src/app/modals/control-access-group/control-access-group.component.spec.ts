import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAccessGroupComponent } from './control-access-group.component';

describe('ControlAccessGroupComponent', () => {
  let component: ControlAccessGroupComponent;
  let fixture: ComponentFixture<ControlAccessGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlAccessGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAccessGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
