import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { CustomdirectivesModule } from '../../shared/directives/customdirectives/customdirectives.module';
import { CustompipesModule } from '../../shared/custompipes/custompipes.module';
import { DataTablesModule } from 'angular-datatables';
import { NgModule } from '@angular/core';
import { UploadAttachmentsComponent } from '../../shared/component/upload-attachments/upload-attachments.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    CustomdirectivesModule,
    CustompipesModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    BsDropdownModule
  ],
  declarations: [UploadAttachmentsComponent],
  exports: [UploadAttachmentsComponent]
})
export class SharedModule {}
