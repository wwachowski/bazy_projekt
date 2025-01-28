import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { EmployeeComponent } from '../components/employee/employee.component';
import { LeaveTypeComponent } from '../components/leave-types/leave-types.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: 'leave-types', component: LeaveTypeComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'leave-applications', component: LeaveApplicationsComponent },
  // { path: 'leave-application-statuses', component: LeaveApplicationStatusesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
