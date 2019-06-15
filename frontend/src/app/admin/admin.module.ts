import { BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { AdminRoutes } from './admin.routing';
import { CommonModule } from '@angular/common';
import { LeftsidemenuComponent } from './leftsidemenu/leftsidemenu.component';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

// import { DragScrollModule } from 'ngx-drag-scroll';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutes,
    TooltipModule.forRoot(),
    // DragScrollModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [AdminComponent, LeftsidemenuComponent],
  providers: []
})
export class AdminModule {}
