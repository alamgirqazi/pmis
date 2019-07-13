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
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ProjectsComponent } from './projects.component';
import { ProjectsModuleRoutes } from './projects.routing';
import { ProjectsmodalComponent } from './projectsmodal/projectsmodal.component';

// import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
    NgSelectModule,
    ProjectsModuleRoutes,
    BsDatepickerModule.forRoot(),
    CustompipesModule.forRoot(),
    CustomdirectivesModule
  ],
  declarations: [ProjectsComponent, ProjectsmodalComponent],
  providers: []
})
export class ProjectsmoduleModule {}
