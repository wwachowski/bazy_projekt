import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationActionsComponent } from './leave-application-actions.component';

describe('LeaveApplicationActionsComponent', () => {
  let component: LeaveApplicationActionsComponent;
  let fixture: ComponentFixture<LeaveApplicationActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveApplicationActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplicationActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
