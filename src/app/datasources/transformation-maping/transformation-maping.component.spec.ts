import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationMapingComponent } from './transformation-maping.component';

describe('TransformationMapingComponent', () => {
  let component: TransformationMapingComponent;
  let fixture: ComponentFixture<TransformationMapingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransformationMapingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationMapingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
