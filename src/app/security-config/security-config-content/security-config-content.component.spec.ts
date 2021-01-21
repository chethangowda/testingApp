import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityConfigContentComponent } from './security-config-content.component';

describe('SecurityConfigContentComponent', () => {
  let component: SecurityConfigContentComponent;
  let fixture: ComponentFixture<SecurityConfigContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityConfigContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityConfigContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
