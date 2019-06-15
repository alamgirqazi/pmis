// import {
//   NgModule,
//   Component,
//   Directive,
//   Output,
//   EventEmitter
// } from "@angular/core";
// import { BrowserModule } from "@angular/platform-browser";
// import {
//   FormBuilder,
//   ReactiveFormsModule,
//   FormsModule,
//   NgControl
// } from "@angular/forms";

// @Directive({
//   // tslint:disable-next-line:directive-selector
//   selector: "[mymasks]",
//   // tslint:disable-next-line:use-host-property-decorator
//   host: {
//     "(ngModelChange)": "onInputChange($event)",
//     "(keydown.backspace)": "onInputChange($event.target.value, true)"
//   }
// })
// // tslint:disable-next-line:directive-class-suffix
// export class PhoneMask {
//   constructor(public model: NgControl) {}

//   @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();

//   onInputChange(event, backspace) {
//     // remove algl mask characters (keep only numeric)
//     if (event) {
//       let newVal = event.replace(/\D/g, "");
//       const rawValue = newVal;
//       // don't show braces for empty value
//       if (newVal.length == 0) {
//         newVal = "";
//       } else if (newVal.length <= 3) {
//         // don't show braces for empty groups at the end
//         newVal = newVal.replace(/^(\d{0,3})/, "$1");
//       } else if (newVal.length <= 6) {
//         newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "$1-$2");
//       } else {
//         newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, "$1-$2-$3");
//       }
//       // set the new value
//       this.model.valueAccessor.writeValue(newVal);
//       this.rawChange.emit(rawValue);
//     }
//   }
// }
