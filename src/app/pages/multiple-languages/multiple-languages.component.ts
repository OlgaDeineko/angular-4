import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISubdomainInfo} from '../../interfaces/i-subdomain-info';
import {SessionService} from '../../services/session.service';
import {TreeService} from '../../services/tree.service';
import {SettingService} from '../../services/setting.service';
import {ToastService} from '../../services/toast.service';
import {FormGroup} from '@angular/forms';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {ILanguages} from '../../interfaces/i-languages';
import {AVAILABLE_LANGUAGES} from '../../constants';
import {ILang} from '../../interfaces/i-lang';

@Component({
  selector: 'ma-multiple-languages',
  templateUrl: './multiple-languages.component.html',
  styleUrls: ['./multiple-languages.component.scss']
})
export class MultipleLanguagesComponent implements OnInit, OnDestroy {
  currentSubdomain: string;
  myltiplelangForm: FormGroup;
  languages: ILanguages;
  defaultSystemLang: string = 'nl';
  available_languages = AVAILABLE_LANGUAGES;
  private _languagesSettingsSub: AnonymousSubscription;
  private _defaultLangSub: AnonymousSubscription;

  constructor(private $Toast: ToastService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $Tree: TreeService) {
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;

    this._languagesSettingsSub = this.$Setting.languages
      .subscribe((languages: ILanguages) => {
        if (languages) {
          this.languages = languages;
        }
      });

    this._defaultLangSub = this.$Setting.lang
      .subscribe((language: ILang) => {
        this.defaultSystemLang = language.code;
      });

    this.myltiplelangForm = new FormGroup({});
    AVAILABLE_LANGUAGES.forEach((lang) => {
      this.myltiplelangForm.addControl(lang.code, new FormGroup({}));
    });
  }

  submit() {
    let myltiplelangFormData = this.myltiplelangForm.getRawValue();
    let arrOfLanguages = [];
    Object.keys(myltiplelangFormData).map(function (objectKey, index) {
      if (myltiplelangFormData[objectKey].allowLang === 'true') {
        arrOfLanguages.push({
          code: objectKey,
          is_allowed_for_frontend: myltiplelangFormData[objectKey].is_allowed_for_frontend
        });
      }
    });
    if (this.defaultSystemLang === 'nl') {
      if (myltiplelangFormData['nl'].allowLang === 'false') {
        arrOfLanguages.push({
          code: 'nl',
          is_allowed_for_frontend: 1
        });
      }
    } else {
      if (myltiplelangFormData['en'].allowLang === 'false') {
        arrOfLanguages.push({
          code: 'en',
          is_allowed_for_frontend: 1
        });
      }
    }

    this.$Setting.saveMultiplyLanguage(arrOfLanguages, this.$Session.subdomain.data).then(() => {
        this.$Setting.getKBSettings();
        this.$Toast.success('MESSAGES.LANGUAGES_SAVED');
      }
    ).catch((error) => {
      this.$Toast.showServerErrors(error);
    });
  }

  switchKB(subdomain: ISubdomainInfo) {
    this.$Session.subdomain.data = subdomain.subdomain;
    this.currentSubdomain = this.$Session.subdomain.data;
    this.$Setting.getKBSettings();
    this.$Tree.rebuildTree();
  }

  ngOnDestroy() {
    this._languagesSettingsSub.unsubscribe();
  }
}
