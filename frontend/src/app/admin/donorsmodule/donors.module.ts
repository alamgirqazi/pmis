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
import { DonorsComponent } from './donors.component';
import { DonorsModuleRoutes } from './donors.routing';
import { DonorsmodalComponent } from './donorsmodal/donorsmodal.component';
import { NgModule } from '@angular/core';

// import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    DonorsModuleRoutes,
    BsDatepickerModule,
    CustompipesModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [DonorsComponent, DonorsmodalComponent],
  providers: []
})
export class DonorsmoduleModule {}
