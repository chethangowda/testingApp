import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSchemaDialogComponent } from './json-schema-dialog.component';

describe('JsonSchemaDialogComponent', () => {
  let component: JsonSchemaDialogComponent;
  let fixture: ComponentFixture<JsonSchemaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JsonSchemaDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonSchemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
