import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmalConfigComponent } from './pmal-config.component';

describe('PmalConfigComponent', () => {
  let component: PmalConfigComponent;
  let fixture: ComponentFixture<PmalConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmalConfigComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
