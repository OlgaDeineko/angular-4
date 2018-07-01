import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnonymousSubscription } from 'rxjs/Subscription';

import { SettingService } from '../../services/setting.service';
import { ToastService } from '../../services/toast.service';
import { SessionService } from '../../services/session.service';
import { TreeService } from '../../services/tree.service';

import { IAppearance } from '../../interfaces/i-appearance';
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';
import { APPEARANCE_URL_PATTERN } from '../../constants';
import { FileService } from '../../services/file.service';
import { ILang } from '../../interfaces/i-lang';


@Component({
  selector: 'ma-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
})
export class AppearanceComponent implements OnInit, OnDestroy {
  appearanceForm: FormGroup;
  appearanceImageForm: FormGroup;
  translateLabelsForm: FormGroup;

  fontBase: string[] = ['Arial', 'Times New Roman', 'Open Sans', 'Lato', 'Century Gothic'];

  currentSubdomain: string;
  labels: any;
  languages: ILang[];
  defaultSystemLang: ILang;

  private _languagesSettingsSub: AnonymousSubscription;
  private _defaultLangSub: AnonymousSubscription;
  appearanceSub: AnonymousSubscription;

  constructor(private $Setting: SettingService,
              private $fb: FormBuilder,
              private $Toast: ToastService,
              private $Tree: TreeService,
              private $File: FileService,
              private $Session: SessionService) {
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;

    this._defaultLangSub = this.$Setting.lang
      .subscribe((language: ILang) => {
        this.defaultSystemLang = language;
      });

    this.appearanceForm = new FormGroup({
      kbName: new FormControl(''),
      kbSubtitle: new FormControl(''),
      headColor: new FormControl(''),
      linkColor: new FormControl(''),
      footerColor: new FormControl(''),
      kbTitleColor: new FormControl(''),
      buttonColor: new FormControl(''),
      menuBarColor: new FormControl(''),
      buttonTextColor: new FormControl(''),
      footerTitleColor: new FormControl(''),
      bodyFont: new FormControl('Times New Roman'),
      titleFont: new FormControl('Times New Roman'),
      footerFont: new FormControl('Times New Roman'),
      logoURL: new FormControl('', [
        Validators.pattern(APPEARANCE_URL_PATTERN)
      ]),
      footerTitle: new FormControl(''),
      contactURL: new FormControl('', [
        Validators.pattern(APPEARANCE_URL_PATTERN)
      ]),
      searchText: new FormControl(''),
      headerCode: new FormControl(''),
      bodyCode: new FormControl(''),
      liveChatScript: new FormControl(''),
      liveChatUrl: new FormControl(''),
      categoryTree: new FormControl('true')
    });
    this.appearanceImageForm = new FormGroup({
      favicon: new FormControl(null),
      header_image: new FormControl(null),
      logo: new FormControl(null),
    });

    this._languagesSettingsSub = this.$Setting.getallowlanguages
      .subscribe((languages: ILang[]) => {
        if (languages && languages.length > 0) {
          this.languages = languages;
        }else {
          this.languages = [this.defaultSystemLang];
        }
      });

    this.appearanceSub = this.$Setting.appearance
      .subscribe((appearance: IAppearance) => {
        if (appearance) {
          if (!appearance.styles || Array.isArray(appearance.styles)) {
            appearance.styles = {}
          }
          this.labels = appearance.labels;

          this.translateLabelsForm = this.$fb.group({});
          this.languages.forEach((lang) => {
            this.translateLabelsForm.addControl(lang.code, this.initLanguage(lang.code));
          });

          this.appearanceForm.patchValue(appearance.styles);
          this.translateLabelsForm.controls['nl'].patchValue({
            kbName: appearance.styles.kbName,
            kbSubtitle: appearance.styles.kbSubtitle,
            footerTitle: appearance.styles.footerTitle,
            searchText: appearance.styles.searchText,
          });
          this.appearanceImageForm.patchValue({
            favicon: appearance.favicon,
            header_image: appearance.header_image,
            logo: appearance.logo,
          });
        }
      });
  }

  submit() {
    let files = this.appearanceImageForm.getRawValue();
    return Promise.all([
      this.$File.saveLogo(files.logo),
      this.$File.saveFavicon(files.favicon),
      this.$File.saveHeaderImage(files.header_image)
    ])
      .then(() => {
        this.translateLabelsForm.controls['nl'].patchValue({
          kbName: this.appearanceForm.getRawValue().kbName,
          kbSubtitle: this.appearanceForm.getRawValue().kbSubtitle,
          footerTitle: this.appearanceForm.getRawValue().footerTitle,
          searchText: this.appearanceForm.getRawValue().searchText,
        });
        let translatesData = this.translateLabelsForm.getRawValue();
        let appearanceData = this.appearanceForm.getRawValue();
        let labels = [];
        Object.keys(translatesData).map(function (objectKey) {
          labels.push(translatesData[objectKey]);
        });
        appearanceData.labels = labels;
        this.$Setting.saveAppearance(appearanceData)
          .then(() => {
            this.$Toast.success('MESSAGES.APPEARANCE_SAVED')
          });
      })
  }

  removeImage(type) {
    switch (type) {
      case 'logo':
        this.$File.removeLogo();
        break;
      case 'favicon':
        this.$File.removeFavicon();
        break;
      case 'header_image':
        this.$File.removeHeaderImage();
        break;
    }
  }

  switchKB(subdomain: ISubdomainInfo) {
    this.$Session.subdomain.data = subdomain.subdomain;
    this.currentSubdomain = this.$Session.subdomain.data;
    this.$Setting.getKBSettings().then(() => {
      this.ngOnInit();
    });
    this.$Tree.rebuildTree();
  }

  ngOnDestroy() {
    this.appearanceSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
    this._defaultLangSub.unsubscribe();
  }
  initLanguage(lang: string) {
    let dataDefault = {
      kbName: '',
      kbSubtitle: '',
      footerTitle: '',
      searchText: '',
      language: ''
    };
    let data = this.labels.filter((l) => l.language === lang)[0];
    data = {...dataDefault, ...data};
    return this.$fb.group({
      kbName: new FormControl(data.kbName),
      kbSubtitle: new FormControl(data.kbSubtitle),
      footerTitle: new FormControl(data.footerTitle),
      searchText: new FormControl(data.searchText),
      language: new FormControl(lang)
    });
  }
}
