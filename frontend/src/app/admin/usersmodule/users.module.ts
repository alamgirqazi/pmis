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
import { UsersComponent } from './users.component';
import { UsersModuleRoutes } from './users.routing';
import { UsersmodalComponent } from './usersmodal/usersmodal.component';

// import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    UsersModuleRoutes,
    BsDatepickerModule,
    CustompipesModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [UsersComponent, UsersmodalComponent],
  providers: []
})
export class UsersmoduleModule {}
