// our root app component
import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[myprice]',
})
export class PriceMask {
  constructor(private el: ElementRef, private control: NgControl) {

  }

  @HostListener('input', ['$event']) onEvent($event) {
    const event = this.el.nativeElement.value;
    // for negative values i.e. -2.00

    // let newVal = event.replace(/[^-0-9\.\d{2}$]/g, '');
    // const negativeCheck = newVal.split('-');

    // if (!(typeof negativeCheck[1] === 'undefined')) {
    //   negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
    //   newVal = negativeCheck[0] + '-' + negativeCheck[1];
    //   if (negativeCheck[0].length > 0) {
    //     newVal = negativeCheck[0];
    //   }
    //
    // }

    // for positive values i.e. 1.00
    let newVal = event.replace(/[^0-9\.\d{2}]/g, '');
    const decimalCheck = newVal.split('.');
    const rawValue = newVal;
    // don't show braces for empty value
    if (!(typeof decimalCheck[1] === 'undefined')) {
      decimalCheck[1] = decimalCheck[1].slice(0, 2);
      console.log(decimalCheck[1].length);
      newVal = decimalCheck[0] + '.' + decimalCheck[1];
    }
    // set the new value
    this.control.control.setValue(newVal);

    console.log(newVal);
  }
}
