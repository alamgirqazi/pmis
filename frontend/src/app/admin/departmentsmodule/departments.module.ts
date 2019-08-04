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
import { DepartmentsComponent } from './departments.component';
import { DepartmentsModuleRoutes } from './departments.routing';
import { DepartmentsmodalComponent } from './departmentsmodal/departmentsmodal.component';

// import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    DepartmentsModuleRoutes,
    BsDatepickerModule,
    CustompipesModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [DepartmentsComponent, DepartmentsmodalComponent],
  providers: []
})
export class DepartmentsmoduleModule {}
