import {
  BsDropdownModule,
  ModalModule,
  TimepickerConfig,
  TimepickerModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { CustomdirectivesModule } from '../../shared/directives/customdirectives/customdirectives.module';
import { CustompipesModule } from '../../shared/custompipes/custompipes.module';
import { DataTablesModule } from 'angular-datatables';
import { NgModule } from '@angular/core';
import { ReportsModuleRoutes } from './reports.routing';
import { ReportsComponent } from './reports.component';
import { Daterangepicker } from 'ng2-daterangepicker';

// import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    FormsModule,
    Daterangepicker,
    ReactiveFormsModule,
    ReportsModuleRoutes,
    BsDatepickerModule,
    CustompipesModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [ReportsComponent],
  providers: []
})
export class ReportsmoduleModule {}
