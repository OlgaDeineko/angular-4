import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyKbListComponent } from './my-kb-list.component';

describe('MyKbListComponent', () => {
  let component: MyKbListComponent;
  let fixture: ComponentFixture<MyKbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyKbListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyKbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
