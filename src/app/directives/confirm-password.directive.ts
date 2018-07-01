import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function confirmPasswordValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.parent || !control.parent.controls[controlName]) {
      return null;
    }
    let isEqual = control.value === control.parent.controls[controlName].value;
    return !isEqual ? {'passwordMismatch': true} : null;
  };
}

@Directive({
  selector: '[maConfirmPassword]',
  providers: [{provide: NG_VALIDATORS, useExisting: ConfirmPasswordDirective, multi: true}]
})
export class ConfirmPasswordDirective implements Validator, OnChanges {
  @Input() maConfirmPassword: string;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['maConfirmPassword'];
    if (change) {
      this.valFn = confirmPasswordValidator(change.currentValue);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }

}
