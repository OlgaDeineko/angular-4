import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAccessComponent } from './control-access.component';

describe('ControlAccessComponent', () => {
  let component: ControlAccessComponent;
  let fixture: ComponentFixture<ControlAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
