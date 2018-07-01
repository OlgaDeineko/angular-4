import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryTranslationComponent } from './create-category-translation.component';

describe('CreateCategoryTranslationComponent', () => {
  let component: CreateCategoryTranslationComponent;
  let fixture: ComponentFixture<CreateCategoryTranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCategoryTranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
