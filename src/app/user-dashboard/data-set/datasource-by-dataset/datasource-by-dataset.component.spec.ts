import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceByDatasetComponent } from './datasource-by-dataset.component';

describe('DatasourceByDatasetComponent', () => {
  let component: DatasourceByDatasetComponent;
  let fixture: ComponentFixture<DatasourceByDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasourceByDatasetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceByDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
