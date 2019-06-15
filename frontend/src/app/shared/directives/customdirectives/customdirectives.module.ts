import {ClickStopPropagation} from '../clickstoppropagation';
import {CommonModule} from '@angular/common';
import { CurrencyDirective } from '../currency.directive';
import {IntegerMask} from '../integermask';
import {NgModule} from '@angular/core';
import {PhoneMask} from '../phonemask';
import {PriceMask} from '../pricemask';

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [PhoneMask, IntegerMask, PriceMask,CurrencyDirective, ClickStopPropagation],
  exports: [PhoneMask, IntegerMask, PriceMask,CurrencyDirective, ClickStopPropagation]
})
export class CustomdirectivesModule {
}
