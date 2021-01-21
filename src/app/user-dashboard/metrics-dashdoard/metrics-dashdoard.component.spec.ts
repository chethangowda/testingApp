import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDashdoardComponent } from './metrics-dashdoard.component';

describe('MetricsDashdoardComponent', () => {
  let component: MetricsDashdoardComponent;
  let fixture: ComponentFixture<MetricsDashdoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetricsDashdoardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsDashdoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
