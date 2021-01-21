import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmalComponent } from './pmal.component';

describe('PmalComponent', () => {
  let component: PmalComponent;
  let fixture: ComponentFixture<PmalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
