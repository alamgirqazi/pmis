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
import { ObjectivesComponent } from './objectives.component';
import { ObjectivesModuleRoutes } from './objectives.routing';
import { ObjectivesmodalComponent } from './objectivesmodal/objectivesmodal.component';
import { SharedModule } from './../shared/shared.module';

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
    ObjectivesModuleRoutes,
    BsDatepickerModule.forRoot(),
    CustompipesModule.forRoot(),
    SharedModule,
    ProgressbarModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [ObjectivesComponent, ObjectivesmodalComponent],
  providers: []
})
export class ObjectivesmoduleModule {}
