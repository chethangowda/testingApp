import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmalRulesConfigComponent } from './pmal-rules-config.component';

describe('PmalRulesConfigComponent', () => {
  let component: PmalRulesConfigComponent;
  let fixture: ComponentFixture<PmalRulesConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmalRulesConfigComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmalRulesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
