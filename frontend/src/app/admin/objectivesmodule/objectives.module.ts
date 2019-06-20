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
import { ObjectivesModuleRoutes } from './objectives.routing';
import { ObjectivesmodalComponent } from './objectivesmodal/objectivesmodal.component';
import { ObjectivesComponent } from './objectives.component';
import { NgSelectModule } from '@ng-select/ng-select';

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
    CustomdirectivesModule
  ],
  declarations: [ObjectivesComponent, ObjectivesmodalComponent],
  providers: []
})
export class ObjectivesmoduleModule {}
