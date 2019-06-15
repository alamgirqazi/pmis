import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DashboardModuleRoutes } from './dashboardmodule.routing';
import { DashboardmoduleComponent } from './dashboardmodule.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    DataTablesModule,
    DashboardModuleRoutes,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DashboardmoduleComponent],
  providers: []
})
export class DashboardmoduleModule {}
