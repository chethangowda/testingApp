import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageRequirementsComponent } from './coverage-requirements.component';

describe('CoverageRequirementsComponent', () => {
  let component: CoverageRequirementsComponent;
  let fixture: ComponentFixture<CoverageRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoverageRequirementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
