import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortModalComponent } from './cohort-modal.component';

describe('CohortModalComponent', () => {
  let component: CohortModalComponent;
  let fixture: ComponentFixture<CohortModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CohortModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CohortModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
