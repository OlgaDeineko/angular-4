import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalComponent } from '../../modals/login-modal/login-modal.component';

import { FaqService } from '../../services/faq.service';
import { GeneralService } from '../../services/general.service';
import { SettingService } from '../../services/setting.service';
import { ToastService } from '../../services/toast.service';
import { UrlService } from '../../services/url.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

import { IAppearance } from '../../interfaces/i-appearance';
import { IFaq } from '../../interfaces/i-faq';
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';
import { ILang } from '../../interfaces/i-lang';
import { TreeTranslateService } from '../../services/tree-translate.service';
import { ICategory } from '../../interfaces/i-category';
import { CategoryService } from '../../services/category.service';


@Component({
  selector: 'ma-visitor-faq',
  templateUrl: './visitor-faq.component.html',
  styleUrls: ['./visitor-faq.component.scss']
})
export class VisitorFaqComponent implements OnInit, OnDestroy {
  instance: VisitorFaqComponent = this;
  appearance: IAppearance;
  translatetrue = false;
  KBName: string;
  searchText: string;
  footerTitle: string;

  faq: IFaq;
  searchModel = '';
  currentsubdomain: string;
  powered_by = false;
  plan: any;
  currentsubdomainData: ISubdomainInfo[];
  kbTemplate: number;
  ContactUsUrl: string;
  LogoUrl: string;
  thumbsUp = false;
  thumbsDown = false;
  openFeedback = false;
  message: string;
  languages: ILang[];
  kblang: ILang;
  tree: ICategory;
  categoryTree: string;

  private _routerSub: AnonymousSubscription;
  private _appearanceSub: AnonymousSubscription;
  private _subdomainsSub: AnonymousSubscription;
  private _languagesSettingsSub: AnonymousSubscription;
  private _visitorLangSub: AnonymousSubscription;
  private _treeSub: AnonymousSubscription;

  constructor(private $Faq: FaqService,
              private $General: GeneralService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $Url: UrlService,
              public $Auth: AuthService,
              private $Route: ActivatedRoute,
              private $Modal: NgbModal,
              private $Router: Router,
              private $Category: CategoryService,
              private $TreeTranslate: TreeTranslateService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this.currentsubdomain = this.$Session.subdomain.data;
    this.kbTemplate = (this.$Url.subdomain === 'livechatpro' || this.$Url.subdomain === 'beta') ? 1 : 0;
    this.$Setting.getParametrsForAlgolia();

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
        if (!this.languages.filter((lang) => lang.code === languag.code)[0]) {
          this.$Session.visitorLang.data = this.$Session.systemLang.data;
          this.kblang = this.$Session.systemLang.data;
          this.$Setting.changeVisitorLanguage(this.kblang);
          this.$TreeTranslate.rebuildTree(this.kblang.code);
          this.$Setting.getKBSettings(this.kblang.code);
          this.$General.setLanguage(this.$Setting.user_settings.getValue().code, this.kblang.code);
          this.$Toast.errorOne('MESSAGES.NOT_ACCESS');
          this.$General.setPageTitle();
          this.$Router.navigate(['/']);
        } else {
          this.kblang = languag;
        }
        this.$Category.getCategoriesForLang(this.kblang.code);
        if (this.appearance && this.appearance.labels.length > 0 && this.appearance.labels.filter((label) => label.language === this.kblang.code).length > 0) {
          this.KBName = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].kbName;
          this.searchText = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].searchText;
          this.footerTitle = this.appearance.labels.filter((label) => label.language === this.kblang.code)[0].footerTitle;
        }
      });

    this._routerSub = this._routerSub || this.$Route.paramMap
      .subscribe((params) => {
        this.$Faq.getBySlug(params.get('faqSlug'))
          .toPromise()
          .then(res => {
            this.faq = res;
            this.faq.answer = this.faq.answer.replace('href="#', `href="${document.location.origin}${document.location.pathname}#`);
            this.$General.setPageTitle(this.faq.question);
            this.searchModel = '';
          })
          .catch(err => {
            if (err.status === 404) {
              this.$Toast.error('FAQ.NOT_FOUND');
              this.$Router.navigate(['/404']);
            } else if (err.status === 400) {
              let message = JSON.parse(err._body).message;
              this.$Toast.errorOne(message);
              this.$Router.navigate(['/']);
            } else {
              this.$Router.navigate(['/']);
            }
          })
        if (params.get('lang')) {
          if (params.get('lang').includes('en')) {
            let newlang = this.languages.filter((l) => l.code === 'en')[0];
            this.kblang = newlang;
            this.$Setting.getKBSettings(newlang.code);
            this.$General.setLanguage(this.$Setting.user_settings.getValue().code, newlang.code);
          } else {
            let newlang = this.languages.filter((l) => l.code === params.get('lang'))[0];
            this.kblang = newlang;
            this.$Setting.getKBSettings(newlang.code);
            this.$General.setLanguage(this.$Setting.user_settings.getValue().code, newlang.code);
          }
        }
      });

    this._appearanceSub = this.$Setting.appearance
      .subscribe((appearance) => {
        this.appearance = appearance;

        let lang = this.$Setting.visitorLanguage.getValue().code;
        if (this.appearance && this.appearance.labels.length > 0 && this.appearance.labels.filter((label) => label.language === lang).length > 0) {
          this.$General._kbName = appearance.labels.filter((label) => label.language === lang)[0].kbName;
          // this.$General.setPageTitle(this.$General._prevTitle);
        }

        this.categoryTree = appearance.styles.categoryTree || 'true';
        if (this.appearance.styles.contactURL) {
          this.checkhttp(this.appearance.styles.contactURL, 'contact');
        }
        if (this.appearance.styles.logoURL) {
          this.checkhttp(this.appearance.styles.logoURL, 'logo');
        }
        this.$General.addSpecStyle([
          {
            selector: '.kb-login-btn, .btn-contact-us, .kb-editFAQ-btn, .editFAQ, .btn-feedback',
            styles: {
              'background': `${this.appearance.styles.buttonColor} !important`
            }
          },
          {
            selector: '.kb-login-btn, .btn-contact-us, .kb-editFAQ-btn, .editFAQ, .btn-feedback',
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
            selector: '.kb-articles a,.kb-categories a,' +
            '.kb-heading-on-category a, .powered-by a, .kb-contact-us, .faq-content a, .lang-drop-down-color,' +
            '.kb-category-tree a',
            styles: {
              'color': `${this.appearance.styles.linkColor} !important`
            }
          },
          {
            selector: '.visitor-article-new, .kb-login-btn',
            styles: {
              'font-family': `'${this.appearance.styles.bodyFont}', Arial, sans-serif`
            }
          },
          {
            selector: '.kb-footer-background',
            styles: {
              'background-color': this.appearance.styles.footerColor,
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
    this.$Setting.changeVisitorLanguage(this.kblang);

    this._treeSub = this.$Category.categoriesTranslate.subscribe((res) => {
      if (res) {
        let preparedCategories = this.prepareCategories(res);
        preparedCategories
          .filter(c => c.type === 'category')
          .forEach((category) => {
            category.categories = [
              ...res
                .filter(c => c.parent_id === category.id)
            ];
          });

        let home = preparedCategories.find(c => c.id === this.$General.homeId);
        home.categories = [
          ...preparedCategories
            .filter(c => c.parent_id === this.$General.homeId)
        ];
        this.tree = home;
      }
    });
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

  feedbackThumbsUp(id: number) {
    this.thumbsUp = true;
    this.thumbsDown = false;
    this.$Faq.faqLike(id).then(() => {
      this.$Toast.success('MESSAGES.FAQ_FEEDBACK');
    });
  }

  feedbackThumbsDown() {
    this.thumbsDown = true;
    this.openFeedback = true;
    this.thumbsUp = false;
  }

  sendMessage(id: number, message: string) {
    this.$Faq.faqDislike(id, message).then(() => {
      this.$Toast.success('MESSAGES.FAQ_FEEDBACK');
      this.message = '';
      this.openFeedback = false;
    });
  }

  ngOnDestroy() {
    this._subdomainsSub.unsubscribe();
    this._appearanceSub.unsubscribe();
    this._routerSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
    this._visitorLangSub.unsubscribe();
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

  copyToClipboard() {
    this.$Toast.success('MESSAGES.ANSWER_COPIED');
  }


  onChangeLanguage(lang) {
    this.kblang = lang;
    this.$Setting.changeVisitorLanguage(lang);
    this.$TreeTranslate.rebuildTree(lang.code);
    this.$Setting.getKBSettings(lang.code);
    this.searchModel = '';
    this.$General.setLanguage(this.$Setting.user_settings.getValue().code, lang.code);
    this.$Router.navigate(['/']);
  }

  translateFaq(id: number) {
    this.$Faq.getById(id, false).then((res) => {
      this.faq = res;
      this.translatetrue = this.translatetrue !== true;
    })
  }

  generateLink(item: ICategory): string[] {
    return this.$Category.getLink(item, 'visitor');
  }

  prepareCategories(categories: ICategory[]) {
    if (categories) {
      let homeName = categories.find(c => c.id === this.$General.homeId).name;

      categories.map((category) => {
        if (category.type !== 'home') {
          category.parent = {...categories.find(c => c.id === category.parent_id)};
        }

        category.categories = [];

        category.hierarchical.lvl0 = homeName;

        if (category.parent) {
          switch (category.type) {
            case 'category':
              category.hierarchical.lvl1 = [homeName, category.name].join(' > ');
              break;
            case 'subcategory':
              category.hierarchical.lvl1 = [homeName, category.parent.name].join(' > ');
              category.hierarchical.lvl2 = [homeName, category.parent.name, category.name].join(' > ');
              break;
          }
        }
        return {...category};
      });

      return categories;
    }
  }
}
