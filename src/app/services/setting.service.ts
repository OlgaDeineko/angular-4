import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Http} from '@angular/http';
// constants
import {AVAILABLE_LANGUAGES, DEFAULT_FILTER, DEFAULT_LANG, DEFAULT_LANG_NAME} from '../constants';
// services
import {UrlService} from './url.service';
import {SessionService} from './session.service';
import {GeneralService} from './general.service';
// interfaces
import {ILang} from '../interfaces/i-lang';
import {IAppearance, IAppearanceStyle} from '../interfaces/i-appearance';
import {IFilter} from '../interfaces/i-filter';
import {IKbAccessibility} from '../interfaces/i-kb-accessibility';
import {ICommonSettings} from '../interfaces/i-common-settings';
import {IKbData} from '../interfaces/i-kb-data';
import {ISubdomainsInfoResponce} from '../interfaces/i-subdomains-info-responce';
import {IUserSettings} from '../interfaces/i-user-settings';
import {IFaqStructure} from '../interfaces/i-faq-structure';
import {IImportData} from '../interfaces/i-import-data';
import {IFaqStructureMapping} from '../interfaces/i-faq-structure-mapping';
import {IHelpWidgetStyles} from '../interfaces/i-help-widget-styles';
import {ILanguages} from '../interfaces/i-languages';

@Injectable()
export class SettingService {
  private _lang: BehaviorSubject<ILang>;
  private _allowed_languages: BehaviorSubject<ILang[]>;
  private _allowed_for_home_page: BehaviorSubject<ILang[]>;
  private _visitorLanguage: BehaviorSubject<ILang>;
  private _user_settings: BehaviorSubject<IUserSettings>;
  private _appearance: BehaviorSubject<IAppearance>;
  private _filter: BehaviorSubject<IFilter>;
  private _sharedFAQ: BehaviorSubject<string[]>;
  private _accessibility: BehaviorSubject<IKbAccessibility[]>;
  private _commonSettings: BehaviorSubject<ICommonSettings>;
  private _subdomain: BehaviorSubject<string>;
  private _algoliaIndex: BehaviorSubject<string>;
  private _custom_subdomain: BehaviorSubject<string>;
  private _parent_subdomain: BehaviorSubject<string>;
  private _helpwidgetstyle: BehaviorSubject<IHelpWidgetStyles>;
  private _languagesSettings: BehaviorSubject<ILanguages>;
  private _multiLanguage: BehaviorSubject<boolean>;
  available_languages = AVAILABLE_LANGUAGES;
  private _subdomains: BehaviorSubject<ISubdomainsInfoResponce> = new BehaviorSubject({subdomains: []});
  private _advancedSettings: IAppearanceStyle;


  constructor(private $Url: UrlService,
              private $http: Http,
              private $Session: SessionService,
              // private $General: GeneralService,
              private $Injector: Injector) {

    this._lang = new BehaviorSubject({});
    this._allowed_for_home_page = new BehaviorSubject([]);
    this._allowed_languages = new BehaviorSubject([]);
    this._user_settings = new BehaviorSubject({lang: {code: DEFAULT_LANG, name: DEFAULT_LANG_NAME}});
    this._visitorLanguage = new BehaviorSubject({});
    this._appearance = new BehaviorSubject({
      logo: false,
      favicon: false,
      header_image: false,
      styles: {},
      labels: []
    });
    this._filter = new BehaviorSubject({sort_by: DEFAULT_FILTER});
    this._sharedFAQ = new BehaviorSubject([]);
    this._accessibility = new BehaviorSubject(null);
    this._subdomain = new BehaviorSubject('');
    this._algoliaIndex = new BehaviorSubject('');
    this._custom_subdomain = new BehaviorSubject('');
    this._commonSettings = new BehaviorSubject(null);
    this._parent_subdomain = new BehaviorSubject('');
    this._helpwidgetstyle = new BehaviorSubject('');
    this._languagesSettings = new BehaviorSubject(null);
    this._multiLanguage = new BehaviorSubject(false);
  }

  // TODO fix this
  get $General() {
    return this.$Injector.get(GeneralService);
  }

  get lang(): BehaviorSubject<ILang> {
    return this._lang
  }

  get user_settings(): BehaviorSubject<IUserSettings> {
    return this._user_settings
  }

  get appearance(): BehaviorSubject<IAppearance> {
    return this._appearance
  }

  get filter(): BehaviorSubject<IFilter> {
    return this._filter
  }

  get sharedFAQ(): BehaviorSubject<string[]> {
    return this._sharedFAQ
  }

  get accessibility(): BehaviorSubject<IKbAccessibility[]> {
    return this._accessibility
  }

  get commonSettings(): BehaviorSubject<ICommonSettings> {
    return this._commonSettings
  }

  get purentSubdomain(): BehaviorSubject<string> {
    return this._parent_subdomain;
  }

  get subdomain(): BehaviorSubject<string> {
    return this._subdomain;
  }

  get algoliaIndex(): BehaviorSubject<string> {
    return this._algoliaIndex
  }

  get custom_subdomain(): BehaviorSubject<string> {
    return this._custom_subdomain
  }

  get subdomains(): BehaviorSubject<ISubdomainsInfoResponce> {
    return this._subdomains
  }

  get helpWidgetStyles(): BehaviorSubject<IHelpWidgetStyles> {
    return this._helpwidgetstyle;
  }

  get languages(): BehaviorSubject<ILanguages> {
    return this._languagesSettings;
  }

  get getallowlanguages(): BehaviorSubject<ILang[]> {
    return this._allowed_languages;
  }

  get allowLanguagesForHomePage(): BehaviorSubject<ILang[]> {
    return this._allowed_for_home_page;
  }

  get visitorLanguage(): BehaviorSubject<ILang> {
    return this._visitorLanguage;
  }

  get checkMultiLanguage(): BehaviorSubject<boolean> {
    return this._multiLanguage;
  }

  getCommonSettings() {
    this.$http.get(`${this.$Url.apiUrl}/settings/common`)
      .map(res => res.json() as { data: ICommonSettings })
      .subscribe((result) => {
        this._commonSettings.next(result.data);
      });
  };

  getAllSubdomains() {
    return this.$http.get(`${this.$Url.apiUrl}/settings/advanced`)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        return res.data;
      });
  };

  // changeLanguage(kbLanguage: ILang, userLanguage: ILang): Promise<any> {
  //   this._lang.next(kbLanguage);
  changeLanguage(userLanguage: ILang): Promise<any> {
    this._user_settings.next(userLanguage);
    return this.saveKBSettings()
      .then(() => {
        this.getCommonSettings();
      });
  };

  changeVisitorLanguage(visitorLanguage: ILang) {
    this.$Session.visitorLang.data = visitorLanguage;
    this._visitorLanguage.next(visitorLanguage);
  };

  changeCategoryOrder(order: string) {
    this._filter.next({sort_by: order});
    this.saveKBSettings();
  };

  getKBSettings(lang: string = null): Promise<any> {
    return this.$http.get(`${this.$Url.apiUrl}/settings/dashboard`, this.$General.getHeadersLang(lang))
      .map(res => res.json())
      .toPromise()
      .then((result) => {

        if (!result.data.appearance.styles) {
          result.data.appearance.styles = {};
        }
        if (!result.data.appearance.labels) {
          result.data.appearance.labels = [];
        }
        this._advancedSettings = result.data.appearance.styles;
        this._languagesSettings.next(result.data.language);

        if (!result.data.language.default_system_language.name) {
          let default_system_language = this.available_languages
            .filter((aLang) => aLang.code === result.data.language.default_system_language.code)[0];
          this._lang.next(default_system_language);
          this.$Session.systemLang.data = default_system_language;
        } else {
          this.$Session.systemLang.data = result.data.language.default_system_language;
          this._lang.next(result.data.language.default_system_language);
        }
        if (this.$Session.visitorLang.data) {
          this.changeVisitorLanguage(this.$Session.visitorLang.data);
        } else {
          this.changeVisitorLanguage(this.$Session.systemLang.data);
        }

        this._allowed_for_home_page.next(result.data.language.allowed_for_home_page);
        if (result.data.language.allowed_languages.length > 0) {
          this._allowed_languages.next(result.data.language.allowed_languages);
        } else {
          this._allowed_languages.next([this._lang.getValue()]);
        }
        // TODO: create exception
        if (result.data.filter) {
          this._filter.next(result.data.filter);
        }
        this._appearance.next(result.data.appearance);
        this._accessibility.next(result.data.kb_accessibility);
        this._subdomain.next(result.data.subdomain);
        this._algoliaIndex.next(result.data.algolia_index);
        this._custom_subdomain.next(result.data.custom_subdomain);
        this._parent_subdomain.next(result.data.parent_subdomain);

        this.$Session.algoliaIndex.data = result.data.algolia_index;
        this.$Session.subdomain.data = result.data.subdomain;
        this._user_settings.next(result.data.language.user_language);
        return;
      })
  };

  langCode() {
    return this._lang.getValue();
  }

  saveKBSettings(): Promise<any> {
    let KBSettings = {
      lang: this._lang.getValue(),
      filter: this._filter.getValue()
    };

    return this.saveUserSettings()
      .then(() => {
        return this.$http.post(`${this.$Url.apiUrl}/settings/dashboard`, KBSettings)
          .toPromise();
      })
  };

  saveUserSettings(): Promise<any> {
    let userSettings = this._user_settings.getValue();

    return this.$http.put(`${this.$Url.apiUrl}/settings/dashboard/user/language`, userSettings)
      .toPromise()
  }

  getKBTemplate() {
    return this.$http.get(`${this.$Url.apiUrl}/settings/templates/home`)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        return res.data;
      });
  }

  saveAppearanceeStyle(appearanceSettings: IAppearanceStyle): Promise<IAppearanceStyle> {
    return this.$http.post(`${this.$Url.apiUrl}/settings/appearance`, appearanceSettings)
      .map(res => res.json())
      .toPromise()
      .then(result => {
        this.getKBSettings();
        return result.data;
      });
  };

  saveAppearance(appearanceSettings: IAppearanceStyle): Promise<IAppearance> {
    return this.$http.post(`${this.$Url.apiUrl}/settings/appearance`, appearanceSettings)
      .map(res => res.json())
      .toPromise()
      .then(result => {
        this.getKBSettings();
        return result.data;
      });
  };

  saveAccessibility(accessibilitySettings: IKbAccessibility): Promise<IKbAccessibility> {
    return this.$http.post(`${this.$Url.apiUrl}/settings/accessibility`, accessibilitySettings)
      .map(res => res.json() as { data: IKbAccessibility })
      .toPromise()
      .then((res) => {
        this._accessibility.next([res.data]);
        return res.data;
      })
  };

  saveSubdomainName(subdomainName: string): Promise<string> {
    return this.$http.put(`${this.$Url.apiUrl}/settings/subdomains`, {'new_name': subdomainName})
      .map(res => res.json() as { data: string })
      .toPromise()
      .then((res) => {
        this._subdomain.next(res.data);
        return res.data;
      });
  };

  saveCustomDomain(subdomain: string): Promise<{ data: string }> {
    return this.$http.post(`${this.$Url.apiUrl}/settings/subdomains/custom`, {'new_name': subdomain})
      .map(res => res.json() as { data: string })
      .toPromise()
  };

  checkSubdomain(subdomain: string): Promise<string> {
    return this.$http.post(
      `${this.$Url.apiUrl}/auth/check-subdomain`,
      {
        'subdomain': subdomain
      }
    )
      .map(res => res.json().data)
      .toPromise()
  };

  getSubdomains(subdomain: string = null) {
    return this.$http.get(`${this.$Url.apiUrl}/settings/subdomains`, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._subdomains.next(res.data);
        return res.data;
      });
  };

  getSubscriptions() {
    return this.$http.get(`${this.$Url.apiUrl}/settings/subscriptions`)
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        return res.data;
      });
  }

  postSubscriptions(index, plan) {
    let subscriptions = {
      subdomain_index: index,
      subscription_plan_id: plan
    };
    return this.$http.post(`${this.$Url.apiUrl}/settings/subdomains/subscriptions`, subscriptions)
      .map(res => res.json().data)
      .toPromise();
  }

  saveKnowledgeBase(knowledgebase: IKbData, subdomain: string = null): Promise<IKbData> {
    knowledgebase.settings = {
      accessibility: knowledgebase.accessibility ? 'private' : 'public'
    };
    delete knowledgebase.accessibility;

    return this.$http.post(`${this.$Url.apiUrl}/settings/subdomains`, knowledgebase, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data)
      .toPromise();
  };

  changeOwner(old_owner_id: string, new_owner_id: string) {
    return this.$http.put(`${this.$Url.apiUrl}/settings/subdomains/owner`, {old_owner_id, new_owner_id})
      .map(res => res.json().data)
      .toPromise();
  };

  importData(data): Promise<IImportData> {
    return this.$http.post(`${this.$Url.apiUrl}/import/file`, data)
      .map(res => res.json().data)
      .toPromise();
  }

  getFileStructure(id: number): Promise<IFaqStructure> {
    return this.$http.get(`${this.$Url.apiUrl}/import/file/${id}/structure`)
      .map(res => res.json().data)
      .toPromise();
  }

  saveFileMapping(id: number, mapping: IFaqStructureMapping) {
    return this.$http.post(`${this.$Url.apiUrl}/import/file/${id}`, mapping)
      .map(res => res.json().data)
      .toPromise();
  }

  saveHelpWidgetStyles(styles: IHelpWidgetStyles, subdomain: string = null) {
    return this.$http.post(`${this.$Url.apiUrl}/settings/help-widget`, styles, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data)
      .toPromise();
  }

  getHelpWidgetStyles(subdomain: string = null) {
    return this.$http.get(`${this.$Url.apiUrl}/settings/help-widget`, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json())
      .toPromise()
      .then((res) => {
        this._helpwidgetstyle.next(res.data);
        return res.data;
      }).catch((err) => {
        if (err.status === 404) {
          this._helpwidgetstyle.next({
            widgetColor: '',
            widgetbuttonColor: '',
            livechatColor: '',
            widgetlinkColor: '',
          });
        }
      });
  }

  saveMultiplyLanguage(languages: ILang[], subdomain: string = null) {
    return this.$http.post(`${this.$Url.apiUrl}/settings/languages`, languages, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data)
      .toPromise();
  }

  getParametrsForAlgolia(): Promise<any> {
    return this.$http.get(`${this.$Url.apiUrl}/settings/cloud-search/resources/shared`)
      .map(res => res.json())
      .toPromise()
      .then((result) => {
        this._sharedFAQ.next((result.data.shared_resources && result.data.shared_resources.faq) || []);
        this._multiLanguage.next(result.data.features.multi_language);
        return;
      })
  }
}

