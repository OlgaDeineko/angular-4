import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UntranslatedComponent } from './untranslated.component';

describe('UntranslatedComponent', () => {
  let component: UntranslatedComponent;
  let fixture: ComponentFixture<UntranslatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UntranslatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UntranslatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
