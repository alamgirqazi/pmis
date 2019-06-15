//our root app component
import {Directive, ElementRef, EventEmitter, HostListener, Output,} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[myinteger]',

})
export class IntegerMask {
  constructor(private el: ElementRef, private control: NgControl) {
  }

  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('input', ['$event']) onEvent($event) {
    const event = this.el.nativeElement.value;
    if (event) {
      console.log(event);
      let newVal = event.replace(/\D/g, '');
      const rawValue = newVal;
      // don't show braces for empty value
      if (newVal.length == 0) {
        newVal = '';
      }
      // set the new value
      this.control.control.setValue(newVal);
      this.rawChange.emit(rawValue);
    }

  }

}
