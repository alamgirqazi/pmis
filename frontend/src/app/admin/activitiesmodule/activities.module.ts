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
import { ActivitiesModuleRoutes } from './activities.routing';
import { ActivitiesmodalComponent } from './activitiesmodal/activitiesmodal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivitiesComponent } from './activities.component';

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
    ActivitiesModuleRoutes,
    BsDatepickerModule.forRoot(),
    CustompipesModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [ActivitiesComponent, ActivitiesmodalComponent],
  providers: []
})
export class ActivitiesmoduleModule {}
