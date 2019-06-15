//our root app component
import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[mymasks]',
})
export class PhoneMask {
  constructor(private el: ElementRef, private control: NgControl) {

  }

  @HostListener('input', ['$event']) onEvent($event) {
    const event = this.el.nativeElement.value;
    // remove algl mask characters (keep only numeric)
    if (event) {
      let newVal = event.replace(/\D/g, '');
      const rawValue = newVal;
      // don't show braces for empty value
      if (newVal.length == 0) {
        newVal = '';
      } else if (newVal.length <= 3) {
        // don't show braces for empty groups at the end
        newVal = newVal.replace(/^(\d{0,3})/, '$1');
      } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '$1-$2');
      } else {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '$1-$2-$3');
      }
      // set the new value
      this.control.control.setValue(newVal);
    }
  }
}
