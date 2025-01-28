import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationStatusesComponent } from './leave-application-statuses.component';

describe('LeaveApplicationStatusesComponent', () => {
  let component: LeaveApplicationStatusesComponent;
  let fixture: ComponentFixture<LeaveApplicationStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveApplicationStatusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplicationStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
