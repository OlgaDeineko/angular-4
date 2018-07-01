import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCsvModalComponent } from './import-csv-modal.component';

describe('ImportCsvModalComponent', () => {
  let component: ImportCsvModalComponent;
  let fixture: ComponentFixture<ImportCsvModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCsvModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCsvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
