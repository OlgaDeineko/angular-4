import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'ma-form-color-picker',
  templateUrl: './form-color-picker.component.html',
  styleUrls: ['./form-color-picker.component.scss']
})
export class FormColorPickerComponent implements OnInit, OnChanges {

  @Input('form') form?: FormGroup;
  @Input('formElement') formElement?: FormGroupDirective;
  @Input('name') name: string;
  @Input('label') label?: string;
  @Input('disabled') disabled?: boolean | null = null;
  @Input('id') id?: string;

  color: string = null;

  constructor() {
  }

  ngOnInit() {
    if (!this.form && this.formElement) {
      this.form = this.formElement.form;
    }

    this.disabled = this.disabled ? true : null;

    this.id = this.id || this.name;

    this.color = this.form.controls[this.name].value;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.color = this.form.controls[this.name].value;
  }

  pickerChange(color: string) {
    this.color = color;
    this.form.controls[this.name].setValue(color);
  }
}
