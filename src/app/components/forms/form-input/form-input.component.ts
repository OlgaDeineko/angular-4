import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'ma-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {

  @Input('form') form?: FormGroup;
  @Input('formElement') formElement?: FormGroupDirective;
  @Input('name') name: string;
  @Input('label') label?: string;
  @Input('placeholder') placeholder?: string;
  @Input('type') type? = 'text';
  @Input('disabled') disabled?: boolean | null = null;
  @Input('id') id?: string;
  @Input('messages') messages?: object = {};
  @Input('addon') addon?: string = null;

  constructor() {
  }

  ngOnInit() {
    if (!this.form && this.formElement) {
      this.form = this.formElement.form;
    }

    this.disabled = this.disabled ? true : null;

    this.placeholder = this.placeholder || this.label || this.name;

    this.id = this.id || this.name;
  }
}
