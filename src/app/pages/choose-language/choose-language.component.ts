import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';

import { ICommonSettings } from '../../interfaces/i-common-settings';
import { ILang } from '../../interfaces/i-lang';
import { DEFAULT_LANG } from '../../constants';
import {GeneralService} from '../../services/general.service';

@Component({
  selector: 'ma-choose-language',
  templateUrl: './choose-language.component.html',
  styleUrls: ['./choose-language.component.scss']
})
export class ChooseLanguageComponent implements OnInit {
  chooseLangForm: FormGroup;

  languages: Observable<ILang[]>;

  constructor(private $Toast: ToastService,
              private $General: GeneralService,
              private $Setting: SettingService) {
    this.languages = this.$Setting.commonSettings
      .map((settings: ICommonSettings) => settings.languages.filter((lang) => lang.code === 'en' || lang.code === 'nl'))
  }

  ngOnInit() {
    this.chooseLangForm = new FormGroup({
      admin: new FormControl(this.$Setting.user_settings.getValue().code || DEFAULT_LANG, [
        Validators.required
      ])
    });
  }

  submit() {
    let formData = this.chooseLangForm.getRawValue();
    this.$Setting.changeLanguage( {code: formData.admin})
      .then(() => {
        this.$General.setLanguage(this.$Setting.user_settings.getValue().code);
        this.$Toast.success('MESSAGES.LANGUAGE_CHANGED');
      })
  }
}
