import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmalConfigHeaderComponent } from './pmal-config-header.component';

describe('PmalConfigHeaderComponent', () => {
  let component: PmalConfigHeaderComponent;
  let fixture: ComponentFixture<PmalConfigHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmalConfigHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmalConfigHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
