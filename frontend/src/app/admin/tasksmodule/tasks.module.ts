import {
  BsDropdownModule,
  ModalModule,
  ProgressbarModule,
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
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from './../shared/shared.module';
import { TasksComponent } from './tasks.component';
import { TasksModuleRoutes } from './tasks.routing';

// import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TasksModuleRoutes,
    BsDatepickerModule.forRoot(),
    CustompipesModule.forRoot(),
    CustomdirectivesModule,
    SharedModule,
    ProgressbarModule.forRoot()
  ],
  declarations: [TasksComponent],
  providers: []
})
export class TasksmoduleModule {}
