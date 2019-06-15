import { CommonModule } from '@angular/common';
import { FilterListPipe } from './filterlist.pipe';
import { NgModule } from '@angular/core';
import { SortPipe } from './sort.pipe';
import { UtcDatePipe } from './utc-date.pipe';
import { KeysPipe } from './keys.pipe';

// import {CustomDatePipe} from '../custom-date.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SortPipe, UtcDatePipe, FilterListPipe, KeysPipe],
  exports: [SortPipe, UtcDatePipe, FilterListPipe, KeysPipe]
})
export class CustompipesModule {
  static forRoot() {
    return {
      ngModule: CustompipesModule,
      providers: []
    };
  }
}
