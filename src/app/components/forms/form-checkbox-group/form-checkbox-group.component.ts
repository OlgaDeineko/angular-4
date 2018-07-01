import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IFormOptions } from '../../../interfaces/i-form-options';

@Component({
  selector: 'ma-form-checkbox-group',
  templateUrl: './form-checkbox-group.component.html',
  styleUrls: ['./form-checkbox-group.component.scss']
})
export class FormCheckboxGroupComponent implements OnInit {

  @Input('form') form?: FormGroup;
  @Input('formElement') formElement?: FormGroupDirective;
  @Input('name') name: string;
  @Input('label') label?: string;
  @Input('id') id?: string;
  @Input('checkAll') checkAll? = false;

  @Input('data') data: Observable<IFormOptions[]>;

  @Input('translatePrefix') translatePrefix? = '';
  @Input('translateSuffix') translateSuffix? = '';

  constructor() {
  }

  ngOnInit() {
    if (!this.form && this.formElement) {
      this.form = this.formElement.form;
    }

    if (!Array.isArray(this.form.controls[this.name].value)) {
      this.form.controls[this.name].patchValue([])
    }

    this.data.subscribe(res => {
      if (this.checkAll) {
        this.form.controls[this.name].patchValue(res.map(i => i.value))
      }
    });

    this.id = this.id || this.name;
  }

  check(value) {
    let selected = this.form.controls[this.name].value;
    let idx = selected.indexOf(value);

    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(value);
    }
    this.form.controls[this.name].patchValue(selected)
  }

}
