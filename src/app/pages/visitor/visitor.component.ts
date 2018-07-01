import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {AnonymousSubscription} from 'rxjs/Subscription';

import {LoginModalComponent} from '../../modals/login-modal/login-modal.component';

import {ToastService} from '../../services/toast.service';
import {GeneralService} from '../../services/general.service';
import {SettingService} from '../../services/setting.service';
import {AuthService} from '../../services/auth.service';
import {FaqService} from '../../services/faq.service';
import {CategoryService} from '../../services/category.service';
import {SessionService} from '../../services/session.service';
import {UrlService} from '../../services/url.service';

import {ICategory} from '../../interfaces/i-category';
import {IAppearance} from '../../interfaces/i-appearance';
import {IOrderList} from '../../interfaces/i-order-list';
import {IFaq} from '../../interfaces/i-faq';
import {ISubdomainInfo} from '../../interfaces/i-subdomain-info';
import {ILang} from '../../interfaces/i-lang';
import {TreeTranslateService} from '../../services/tree-translate.service';

@Component({
  selector: 'ma-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit, OnDestroy {
  instance: VisitorComponent = this;
  name = 'Welcome to KB';
  tree: ICategory;
  appearance: IAppearance;

  KBName: string;
  kbSubtitle: string;
  searchText: string;
  footerTitle: string;

  order: IOrderList;
  currentCategory: string;
  currentCategoryID: number;
  homeSlug: string;
  searchModel = '';
  currentsubdomain: string;
  powered_by = false;
  plan: any;
  mostViewed: IFaq[];
  currentsubdomainData: ISubdomainInfo[];
  kbTemplate: number;
  ContactUsUrl: string;
  LogoUrl: string;
  languages: ILang[];
  kblang: ILang;
  search = 'Search';
  paramLang: string;

  private _treeSub: AnonymousSubscription;
  private _appearanceSub: AnonymousSubscription;
  private _filterSub: AnonymousSubscription;
  private _routeSub: AnonymousSubscription;
  private _subdomainsSub: AnonymousSubscription;
  private _languagesSettingsSub: AnonymousSubscription;
  private _visitorLangSub: AnonymousSubscription;

  constructor(private $Modal: NgbModal,
              private $General: GeneralService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $TreeTranslate: TreeTranslateService,
              private $Faq: FaqService,
              private $Category: CategoryService,
              public $Auth: AuthService,
              private $Router: Router,
              private $Url: UrlService,
              private $Route: ActivatedRoute,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this.currentsubdomain = this.$Session.subdomain.data;
    this.$Setting.getParametrsForAlgolia();
    this.kbTemplate = (this.$Url.subdomain === 'livechatpro' || this.$Url.subdomain === 'beta' ) ? 1 : 0;

    if (this.$Auth.isLogin()) {
      this.$Setting.getSubdomains();
      this.$Auth.getCurrentUser();
    }

    this._subdomainsSub = this.$Setting.subdomains
      .subscribe(subdomains => {
        this.currentsubdomainData = subdomains.subdomains.filter(subdomain => subdomain.subdomain === this.currentsubdomain);
        if (this.currentsubdomainData.length > 0 && this.currentsubdomainData[0].subscription_plan.rules) {
          this.plan = this.currentsubdomainData[0].subscription_plan;
          this.powered_by = this.plan.rules.powered_by;
        } else {
          this.powered_by = true;
        }
      });

    this._languagesSettingsSub = this.$Setting.allowLanguagesForHomePage
      .subscribe((languages: ILang[]) => {
        if (languages && languages.length > 0) {
          this.languages = languages;
        } else {
          this.languages = [this.$Session.systemLang.data];
        }
      });

    this._visitorLangSub = this.$Setting.visitorLanguage
      .subscribe((languag: ILang) => {
        this.appearance = this.$Setting.appearance.getValue();
        if (this.appearance && this.appearance.labels.length > 0 && this.appearance.labels.filter((label) => label.language === languag.code).length > 0) {
          this.$General._kbName = this.appearance.labels.filter((label) => label.language === languag.code)[0].kbName;
        }
        if (!languag) {
          if (!this.$Session.visitorLang.data) {
            this.$Session.visitorLang.data = this.$Session.systemLang.data;
          }
          this.kblang = this.$Session.visitorLang.data;
        } else {
          this.kblang = languag;
          this.$Session.visitorLang.data = languag;
        }
        if (!this.languages.filter((lang) => lang.code === this.$Session.visitorLang.data.code)[0]) {
          this.$Session.visitorLang.data = this.$Session.systemLang.data;
          this.kblang = this.$Session.visitorLang.data;
          this.$Setting.changeVisitorLanguage(this.kblang);
          this.$TreeTranslate.rebuildTree(this.kblang.code);
          this.$Setting.getKBSettings(this.kblang.code);
          this.$General.setLanguage(this.$Setting.user_settings.getValue().code, this.kblang.code);
        }
        if (this.appearance && this.appearance.labels.length > 0 && this.appearance.labels.filter((label) => label.language === this.kblang.code).length > 0) {
          this.KBName = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].kbName;
          this.kbSubtitle = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].kbSubtitle;
          this.searchText = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].searchText;
          this.footerTitle = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].footerTitle;
        }
      });

    this._routeSub = this.$Route.paramMap
      .subscribe(params => {
        this.currentCategory = this.$General.getCurrentSlugByParams(params);
        this.$Category
          .getBySlug(this.$General.getCurrentSlugByParams(params))
          .toPromise()
          .catch(error => {
            if (error.error && error.error.status === 404) {
              this.$Toast.error('CATEGORY.NOT_FOUND');
              this.$Router.navigate(['/404']);
            } else {
              this.$Toast.showServerErrors(error);
              this.$Router.navigate(['/']);
            }
          });
        if (params.get('lang') && params.get('lang').includes('en')) {
          this.paramLang = 'en';
        } else {
          this.paramLang = params.get('lang');
        }
        if (this.paramLang) {
          let newlang = this.languages.filter((l) => l.code === this.paramLang)[0];
          this.kblang = newlang;
          this.$Setting.getKBSettings(newlang.code);
          this.$General.setLanguage(this.$Setting.user_settings.getValue().code, newlang.code);
        }
        this.$TreeTranslate.getTree(this.paramLang || this.kblang.code, this.$General.getCurrentSlugByParams(params));
      });

    this.homeSlug = this.$General.homeSlug;
    this._treeSub = this.$TreeTranslate.tree
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        this.tree = res;
        this.$General.setPageTitle(this.tree.type === 'home' ? '' : this.tree.name);
        let categoryId =  this.tree.type === 'subcategory' ? this.tree.parent_id : this.tree.id;
        if (this.kbTemplate === 1 && categoryId !== this.currentCategoryID) {
          this.$Faq.getMostViewed(categoryId, 30, this.kblang.code)
            .then((articles) => {
              this.mostViewed = articles;
            });
        }
        this.currentCategoryID = this.tree.type === 'subcategory' ? this.tree.parent_id : this.tree.id;
      });


    this._appearanceSub = this.$Setting.appearance
      .subscribe((appearance) => {
        this.appearance = appearance;

        let lang = this.$Setting.visitorLanguage.getValue().code;
        if (this.appearance && this.appearance.labels.length > 0 && this.appearance.labels.filter((label) => label.language === lang).length > 0) {
          this.$General._kbName = appearance.labels.filter((label) => label.language === lang)[0].kbName;
        }

        if (this.appearance.styles.contactURL) {
          this.checkhttp(this.appearance.styles.contactURL, 'contact');
        }
        if (this.appearance.styles.logoURL) {
          this.checkhttp(this.appearance.styles.logoURL, 'logo');
        }


        this.$General.addSpecStyle([
          {
            selector: '.kb-login-btn, .btn-contact-us',
            styles: {
              'background': `${this.appearance.styles.buttonColor} !important`
            }
          },
          {
            selector: '.kb-login-btn, .btn-contact-us',
            styles: {
              'color': `${this.appearance.styles.buttonTextColor} !important`
            }
          },
          {
            selector: '.kb-menu-background',
            styles: {
              'background': `${this.appearance.styles.menuBarColor} !important`
            }
          },
          {
            selector: '.kb-articles a, .kb-categories a,' +
            ' .kb-heading-on-category a, .powered-by a, .kb-contact-us, .visitor-last-created-item a, .lang-drop-down-color',
            styles: {
              'color': `${this.appearance.styles.linkColor} !important`
            }
          },
          {
            selector: '.kb-footer-background',
            styles: {
              'background-color': this.appearance.styles.footerColor,
            }
          },
          {
            selector: '.visitor-new, .kb-login-btn',
            styles: {
              'font-family': `'${this.appearance.styles.bodyFont}', Arial, sans-serif`
            }
          },
          {
            selector: '.kb-sub-category-title, .kb-category-title, .kb-current-category-title',
            styles: {
              'font-family': `'${this.appearance.styles.titleFont}', Arial, sans-serif !important`
            }
          }, {
            selector: '.kb-heading-title, .kb-heading-subtitle',
            styles: {
              'color': `${this.appearance.styles.kbTitleColor} !important`,
              'font-family': `'${this.appearance.styles.titleFont}', Arial, sans-serif !important`
            }
          },
          {
            selector: '.kb-footer-title',
            styles: {
              'color': `${this.appearance.styles.footerTitleColor} !important`,
              'font-family': `'${this.appearance.styles.footerFont}', Arial, sans-serif !important`,
            }
          }
        ]);
      });

    this._filterSub = this.$Setting.filter
      .subscribe((filter) => {
        this.order = this.$General.orderList.find((o) => o.name === filter.sort_by);
      });

    this.$Setting.changeVisitorLanguage(this.kblang);
  }

  login() {
    this.$Modal.open(LoginModalComponent);
  }

  logout() {
    if (this.$Session.fileStructure.data) {
      this.$Session.fileStructure.remove();
    }
    this.$Session.subdomain.data = this.$Url.subdomain;
    this.$Auth.logOut();
  }

  generateLink(item) {
    if (item.type === 'faq') {
      return this.$Faq.getLink(item, 'visitor');
    } else {
      return this.$Category.getLink(item, 'visitor');
    }
  }

  checkhttp(url, param) {
    if (url.includes('http:') || url.includes('https:')) {
      if (param === 'contact') {
        this.ContactUsUrl = url;
      } else {
        this.LogoUrl = url;
      }

    } else {
      if (param === 'contact') {
        this.ContactUsUrl = 'https://' + url;
      } else {
        this.LogoUrl = 'https://' + url;
      }

    }
  }

  onChangeLanguage(lang) {
    this.kblang = lang;
    this.$Setting.changeVisitorLanguage(lang);
    this.$TreeTranslate.rebuildTree(lang.code);
    this.$Setting.getKBSettings(lang.code).then( () => {
      if (this.kbTemplate === 1) {
        this.$Faq.getMostViewed(this.currentCategoryID, 30, this.kblang.code)
          .then((articles) => {
            this.mostViewed = articles;
          });
      }
    });
    this.searchModel = '';
    this.$General.setLanguage(this.$Setting.user_settings.getValue().code, lang.code);
    this.$Router.navigate(['/']);
  }

  ngOnDestroy() {
    this._subdomainsSub.unsubscribe();
    this._treeSub.unsubscribe();
    this._appearanceSub.unsubscribe();
    this._filterSub.unsubscribe();
    this._routeSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
    this._visitorLangSub.unsubscribe();
  }


}

