import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../../../services/auth.service';
import {SessionService} from '../../../services/session.service';
import {SettingService} from '../../../services/setting.service';
import {TreeService} from '../../../services/tree.service';

import {ISubdomainInfo} from '../../../interfaces/i-subdomain-info';
import {IS_LOCAL} from '../../../../environments/environment';
import {UrlService} from '../../../services/url.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {GeneralService} from '../../../services/general.service';
import {TreeTranslateService} from '../../../services/tree-translate.service';
import {ILang} from '../../../interfaces/i-lang';

@Component({
  selector: 'ma-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  isLocal: boolean = IS_LOCAL;
  languages: ILang[];
  disableBtn = false;

  private _languagesSettingsSub: AnonymousSubscription;
  private _routeSub: AnonymousSubscription;

  constructor(public router: Router,
              private $Route: ActivatedRoute,
              public $Auth: AuthService,
              public $Session: SessionService,
              private $Tree: TreeService,
              private $Url: UrlService,
              private $General: GeneralService,
              private $TreeTranslate: TreeTranslateService,
              private $Setting: SettingService) {
  }

  ngOnInit() {
    this._routeSub = this.$Route.url
      .subscribe(res => {
        if (location.pathname.includes('untranslated')) {
          this.disableBtn = true;
        }
      })

    this._languagesSettingsSub = this.$Setting.allowLanguagesForHomePage
      .subscribe((languages: ILang[]) => {
        if (languages && languages.length > 0) {
          this.languages = languages;
        } else {
          this.languages = [{name: 'Dutch', code: 'nl'}];
        }
      });
  }

  logout() {
    this.$Session.fileStructure.remove();
    this.$Session.subdomain.data = this.$Url.subdomain;
    this.$Auth.logOut();
  }

  goToSubdomain(subdomain: ISubdomainInfo) {
    this.$Session.subdomain.data = subdomain.subdomain;
    this.$Tree.rebuildTree();
    this.$Setting.getKBSettings();
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
  }

  viewKB() {
    let kbRout = this.$Session.kbRout.data;
    kbRout.shift();
    let link = kbRout.join('/');
    if (kbRout[0] !== undefined) {
      switch (kbRout[0]) {
        case 'en-gb':
          let lang = {name: 'English', code: 'en'};
          this.$Setting.changeVisitorLanguage(lang);
          this.$TreeTranslate.rebuildTree(lang.code);
          this.$Setting.getKBSettings(lang.code);
          this.$General.setLanguage(this.$Setting.user_settings.getValue().code, lang.code);
          break;
        default:
          let l = this.languages.filter((language) => language.code === kbRout[0])[0];
          this.$Setting.changeVisitorLanguage(l);
          this.$TreeTranslate.rebuildTree(l.code);
          this.$Setting.getKBSettings(l.code);
          this.$General.setLanguage(this.$Setting.user_settings.getValue().code, l.code);
      }
    }
    window.open(this.getUrl(link), '_blank')
  }

  getUrl(link) {
    let urlLink = window.location.origin + '/' +  link;
    return urlLink
  }
}
