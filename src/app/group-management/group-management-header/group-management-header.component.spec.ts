import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupManagementHeaderComponent } from './group-management-header.component';

describe('GroupManagementHeaderComponent', () => {
  let component: GroupManagementHeaderComponent;
  let fixture: ComponentFixture<GroupManagementHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupManagementHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
