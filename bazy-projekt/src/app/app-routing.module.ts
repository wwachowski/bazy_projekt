import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { EmployeeComponent } from '../components/employee/employee.component';
import { LeaveTypeComponent } from '../components/leave-types/leave-types.component';
import { LeaveApplicationStatusesComponent } from '../components/leave-application-statuses/leave-application-statuses.component';
import { LeaveApplicationActionsComponent } from '../components/leave-application-actions/leave-application-actions.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: 'leave-types', component: LeaveTypeComponent },
  { path: 'leave-application-statuses', component: LeaveApplicationStatusesComponent },
  { path: 'leave-application-actions', component: LeaveApplicationActionsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
  // { path: 'leave-applications', component: LeaveApplicationsComponent },
  // { path: 'leave-application-statuses', component: LeaveApplicationStatusesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
