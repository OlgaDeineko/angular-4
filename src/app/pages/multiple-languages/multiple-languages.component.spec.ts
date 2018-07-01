import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleLanguagesComponent } from './multiple-languages.component';

describe('MultipleLanguagesComponent', () => {
  let component: MultipleLanguagesComponent;
  let fixture: ComponentFixture<MultipleLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
