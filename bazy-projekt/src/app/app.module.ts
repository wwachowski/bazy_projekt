import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { EmployeeComponent } from '../components/employee/employee.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { LeaveTypeComponent } from '../components/leave-types/leave-types.component';
import { LeaveApplicationStatusesComponent } from '../components/leave-application-statuses/leave-application-statuses.component';
import { LeaveApplicationActionsComponent } from '../components/leave-application-actions/leave-application-actions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeeComponent,
    DialogComponent,
    LeaveTypeComponent,
    LeaveApplicationStatusesComponent,
    LeaveApplicationActionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
