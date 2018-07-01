import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {LIVE_CHAT_URL_PATTERN} from '../../constants';
import {HELP_WIDGET_URL, HELP_WIDGET_VERSION} from '../../../environments/environment';

import {SessionService} from '../../services/session.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {SettingService} from '../../services/setting.service';
import {ToastService} from '../../services/toast.service';
import {IAppearance} from '../../interfaces/i-appearance';
import {ISubdomainInfo} from '../../interfaces/i-subdomain-info';
import {TreeService} from '../../services/tree.service';


@Component({
  selector: 'ma-help-widget',
  templateUrl: './help-widget.component.html',
  styleUrls: ['./help-widget.component.scss']
})
export class HelpWidgetComponent implements OnInit, OnDestroy {
  widgetForm: FormGroup;
  helpWidgetForm: FormGroup;

  helpWidgetSub: AnonymousSubscription;
  appearanceSub: AnonymousSubscription;
  subdomainsSub: AnonymousSubscription;
  currentSubdomain: string;
  currentsubdomainData: ISubdomainInfo[];
  powered_by = false;
  plan: any;

  private _params = {
    knowledgeBase: null,
    algolia: null,
    liveChatUrl: null,
    v: HELP_WIDGET_VERSION,
  };

  constructor(private $Session: SessionService,
              private $Toast: ToastService,
              private $Setting: SettingService,
              private $Tree: TreeService) {
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;
    this._params.knowledgeBase = this.$Session.subdomain.data;
    this._params.algolia = this.$Session.algoliaIndex.data;

    this.widgetForm = new FormGroup({
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
      logoURL: new FormControl(''),
      footerTitle: new FormControl(''),
      contactURL: new FormControl(''),
      searchText: new FormControl(''),
      headerCode: new FormControl(''),
      bodyCode: new FormControl(''),
      liveChatScript: new FormControl(this._generateCode(), []),
      liveChatUrl: new FormControl('', [
        Validators.pattern(LIVE_CHAT_URL_PATTERN)
      ]),
      categoryTree: new FormControl('true')
    });

    this.helpWidgetForm = new FormGroup({
      widgetColor: new FormControl(''),
      widgetbuttonColor: new FormControl(''),
      livechatColor: new FormControl(''),
      widgetlinkColor: new FormControl(''),
      poweredBy: new FormControl(this.powered_by),
      lang: new FormControl(this.$Session.systemLang.data.code)
    });

    this.helpWidgetSub = this.$Setting.helpWidgetStyles.subscribe((styles) => {
      if (styles) {
        this.helpWidgetForm.patchValue(styles);
      }
    });

    this.appearanceSub = this.$Setting.appearance
      .subscribe((appearance: IAppearance) => {
        if (appearance) {
          if (!appearance.styles || Array.isArray(appearance.styles)) {
            appearance.styles = {};
          }
          this.widgetForm.patchValue(appearance.styles);
          if (appearance.styles.liveChatScript === '' || !appearance.styles.liveChatScript) {
            this.widgetForm.patchValue({liveChatScript: this._generateCode()});
          }
          if (!appearance.styles.liveChatUrl) {
            this.widgetForm.patchValue({liveChatUrl: ''});
          }
        }
      });
    this.subdomainsSub = this.$Setting.subdomains
      .subscribe(subdomains => {
        this.currentsubdomainData = subdomains.subdomains.filter(subdomain => subdomain.subdomain === this.currentSubdomain);
        if (this.currentsubdomainData.length > 0 && this.currentsubdomainData[0].subscription_plan.rules) {
          this.plan = this.currentsubdomainData[0].subscription_plan;
          this.powered_by = this.plan.rules.powered_by;
        } else {
          this.powered_by = true;
        }
      });

    this.widgetForm.controls['liveChatUrl'].valueChanges
      .subscribe(val => {
        if (this.widgetForm.controls['liveChatUrl'].valid) {
          this._params['liveChatUrl'] = val.replace(/(http|https):\/\//ig, '').replace(/(\/)$/, '');
        } else {
          this._params['liveChatUrl'] = null;
        }
        this.widgetForm.patchValue({liveChatScript: this._generateCode()});
      })
  }

  private _generateCode(): string {
    let stringParams = Object
      .keys(this._params)
      .filter(value => !!this._params[value])
      .map(value => `${value}=${encodeURIComponent(this._params[value])}`)
      .join('&');
    return `<script src="${HELP_WIDGET_URL}?${stringParams}"></script>`;
  }

  submit() {
    let widgetData = this.widgetForm.getRawValue();
    widgetData.labels = this.$Setting.appearance.getValue().labels;
    this.$Setting.saveAppearanceeStyle(widgetData)
      .then(() => {
        this.helpWidgetForm.patchValue({widgetlinkColor: this.$Setting.appearance.getValue().styles.linkColor});
        this.$Setting.saveHelpWidgetStyles(this.helpWidgetForm.getRawValue()).then(() => {
          this.$Setting.getHelpWidgetStyles();
          this.$Toast.success('MESSAGES.HELP_WIDGET_DATA_SAVED');
        })

      });
  }

  switchKB(subdomain: ISubdomainInfo) {
    this.$Session.subdomain.data = subdomain.subdomain;
    this.$Setting.getKBSettings().then(() => {
      this.currentSubdomain = this.$Session.subdomain.data;
      this._params.knowledgeBase = this.$Session.subdomain.data;
      this._params.algolia = this.$Session.algoliaIndex.data;
      this.widgetForm.patchValue({liveChatScript: this._generateCode()});
    });
    this.$Tree.rebuildTree();
  }

  ngOnDestroy() {
    this.appearanceSub.unsubscribe();
    this.helpWidgetSub.unsubscribe();
    this.subdomainsSub.unsubscribe();
  }
}
