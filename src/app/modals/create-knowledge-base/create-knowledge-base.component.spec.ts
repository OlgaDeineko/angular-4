import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKnowledgeBaseComponent } from './create-knowledge-base.component';

describe('CreateKnowledgeBaseComponent', () => {
  let component: CreateKnowledgeBaseComponent;
  let fixture: ComponentFixture<CreateKnowledgeBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateKnowledgeBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
