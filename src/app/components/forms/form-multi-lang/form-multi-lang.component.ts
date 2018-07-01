import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ILanguages} from '../../../interfaces/i-languages';

@Component({
  selector: 'ma-form-multi-lang',
  templateUrl: './form-multi-lang.component.html',
  styleUrls: ['./form-multi-lang.component.scss']
})
export class FormMultiLangComponent implements OnInit, OnChanges {
  dataDefault = {
    allowLang: 'false',
    is_allowed_for_frontend: 0,
  };
  data: any;

  @Input('form') form?: FormGroup;
  @Input('isDefault') isDefault?: boolean | null = null;
  @Input('title') title?: string;
  @Input('name') name?: string;
  @Input('langData') langData?: ILanguages;

  constructor() {
  }

  ngOnInit() {
    this.form.controls[this.name] = new FormGroup({
      allowLang: new FormControl(this.dataDefault.allowLang),
      is_allowed_for_frontend: new FormControl(this.dataDefault.is_allowed_for_frontend),
    });
    this.form.controls[this.name].patchValue({allowLang: this.contains(this.name, this.langData.allowed_languages).toString()});
    switch (this.contains(this.name, this.langData.allowed_for_home_page).toString()) {
      case 'true':
        this.form.controls[this.name].patchValue({is_allowed_for_frontend: 1});
        break;
      case 'false':
        this.form.controls[this.name].patchValue({is_allowed_for_frontend: 0});
        break;
    }
    if (this.isDefault) {
      this.form.controls[this.name].patchValue({allowLang: 'true', is_allowed_for_frontend: 1});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.form.controls[this.name].patchValue({allowLang: this.contains(this.name, this.langData.allowed_languages).toString()});
      switch (this.contains(this.name, this.langData.allowed_for_home_page).toString()) {
        case 'true':
          this.form.controls[this.name].patchValue({is_allowed_for_frontend: 1});
          break;
        case 'false':
          this.form.controls[this.name].patchValue({is_allowed_for_frontend: 0});
          break;
      }
    }
  }

  contains(str, a) {
    for (let i = 0; i < a.length; i++) {
      if (a[i].code === str) {
        return true;
      }
    }
    return false;
  }

}
