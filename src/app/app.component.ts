import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {SessionService} from './services/session.service';
import {UrlService} from './services/url.service';
import {SettingService} from './services/setting.service';
import {GeneralService} from './services/general.service';
import {ToastService} from './services/toast.service';
import {DEFAULT_LANG} from './constants';
import {IAppearanceStyle} from './interfaces/i-appearance';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'ma-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  advanced_settings: IAppearanceStyle;

  constructor($Translate: TranslateService,
              $Session: SessionService,
              $Url: UrlService,
              $Setting: SettingService,
              $General: GeneralService,
              $Router: Router,
              $Toast: ToastService,
              $Auth: AuthService,
              $Route: ActivatedRoute) {

    $Translate.setDefaultLang(DEFAULT_LANG);
    $Translate.use(DEFAULT_LANG);

    $Session.subdomain.data = $Session.subdomain.data || $Url.subdomain;

    $Toast.showSavedMessage();

    $Setting.getKBSettings().then(() => {
      this.advanced_settings = $Setting.appearance.getValue().styles;
      if (this.advanced_settings && (this.advanced_settings.headerCode || this.advanced_settings.bodyCode)) {
        if (this.advanced_settings.headerCode.length) {
          document.head.insertAdjacentHTML('afterbegin', this.advanced_settings.headerCode);
        }
        if (this.advanced_settings.bodyCode.length) {
          document.body.insertAdjacentHTML('afterbegin', this.advanced_settings.bodyCode);

        }
      }
    });

    // Observable.merge($Setting.lang, $Setting.user_settings).subscribe(() => {
    //   let visitorLang = $Setting.visitorLanguage.getValue().code;
    //   $General.setLanguage($Setting.user_settings.getValue().code, visitorLang || DEFAULT_LANG);
    // });

    $Setting.appearance.subscribe((appearance) => {
      $General.setFavicon(appearance.favicon);
    });

    $Router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        let visitorLang = $Setting.visitorLanguage.getValue().code;
        $General.setLanguage($Setting.user_settings.getValue().code, visitorLang || DEFAULT_LANG);
        $Url.setPreviousPage($Route.root, event.url);
        $Auth.reIdentifyWebServices();

        $Session.kbRout.data = ['/']
      })
  }
}
