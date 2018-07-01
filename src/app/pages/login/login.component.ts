import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {Title} from '@angular/platform-browser';

import {EMAIL_PATTERN, PASSWORD_PATTERN, REGISTRATION_URL} from '../../constants';

import {AuthService} from '../../services/auth.service';
import {ToastService} from '../../services/toast.service';
import {SettingService} from '../../services/setting.service';
import {TreeService} from '../../services/tree.service';

import {ILoginData} from '../../interfaces/i-login-data';

import {ForgotPasswordComponent} from '../../modals/forgot-password/forgot-password.component';
import {UrlService} from '../../services/url.service';
import {SessionService} from '../../services/session.service';
import {TreeTranslateService} from '../../services/tree-translate.service';
import {TranslateService} from '@ngx-translate/core';
import {ILang} from '../../interfaces/i-lang';


@Component({
  selector: 'ma-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  KBName: string;
  subdomain: string;
  loginForm: FormGroup;
  $ActiveModal: NgbActiveModal;
  REGISTRATION_URL: string = REGISTRATION_URL;
  kblang: ILang;
  defaultSystemLang: ILang;
  private _appearanceSub: AnonymousSubscription;
  private _subdomainSub: AnonymousSubscription;
  private _visitorLangSub: AnonymousSubscription;
  private _defaultLangSub: AnonymousSubscription;

  constructor(private $Auth: AuthService,
              private $Toast: ToastService,
              private $Setting: SettingService,
              private $Router: Router,
              private $Title: Title,
              private $Session: SessionService,
              private $Url: UrlService,
              private $Tree: TreeService,
              private $TreeTranslate: TreeTranslateService,
              private $Translate: TranslateService,
              private $modal: NgbModal) {
    $Session.subdomain.data = $Url.subdomain;
  }

  ngOnInit() {
    this._defaultLangSub = this.$Setting.lang
      .subscribe((languag: ILang) => {
        if (languag.code) {
          this.defaultSystemLang = languag;
          this.$Translate.setDefaultLang(languag.code);
          this.$Translate.use(languag.code);
        }
      });

    this._visitorLangSub = this.$Setting.visitorLanguage
      .subscribe((languag: ILang) => {
        if (languag) {
          this.kblang = languag;
        } else {
          this.kblang = this.defaultSystemLang;
        }

      });

    this._appearanceSub = this.$Setting.appearance
      .subscribe(appearance => {
        let lang = this.kblang.code;
        if (appearance && appearance.labels.length > 0 && appearance.labels.filter((label) => label.language === lang).length > 0) {
          this.KBName = appearance.labels.filter((label) => label.language === lang)[0].kbName;
        }
        if (this.$Router.isActive('/login', true) === true) {
          let siteTitle = 'MyAnswers';
          this.$Title.setTitle(siteTitle);
        }
      });

    this._subdomainSub = this.$Setting.subdomain
      .subscribe(subdomain => {
        this.subdomain = subdomain;
      });


    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ]),
    });
  }

  ngOnDestroy() {
    this._appearanceSub.unsubscribe();
    this._subdomainSub.unsubscribe();
    this._visitorLangSub.unsubscribe();
  }

  login() {
    let loginData: ILoginData = this.loginForm.getRawValue();
    loginData.subdomain = this.subdomain;
    this.$Auth.removeUser();
    this.$Auth.login(loginData)
      .then(() => {
        return this.$Setting.getKBSettings();
      })
      .then(() => {
        this.$Tree.rebuildTree();
        this.$TreeTranslate.rebuildTree(this.kblang.code);
        if (this.$ActiveModal) {
          this.$ActiveModal.close();
        } else {
          this.$Auth.getCurrentUser();
          if (this.$Auth.getRole() === 'admin' || this.$Auth.getRole() === 'Super Admin') {
            this.$Router.navigate(['admin']);
          } else {
            this.$Router.navigate(['']);
          }
        }
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }

  forgot() {
    if (this.$ActiveModal) {
      this.$ActiveModal.close();
    }
    let forgotPasswordModal = this.$modal.open(ForgotPasswordComponent);
    forgotPasswordModal.componentInstance.email = this.loginForm.get('email').value;
  }
}
