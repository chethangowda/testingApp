import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceConfigContentComponent } from './service-config-content.component';


describe('ServiceConfigContentComponent', () => {
  let component: ServiceConfigContentComponent;
  let fixture: ComponentFixture<ServiceConfigContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceConfigContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
