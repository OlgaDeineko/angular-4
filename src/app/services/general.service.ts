import {Injectable, Injector} from '@angular/core';
import {ParamMap, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Headers, RequestOptions, RequestOptionsArgs} from '@angular/http';
import {URLSearchParams} from '@angular/http';

import {IS_LOCAL, MAIN_DOMAIN} from '../../environments/environment';

import {SessionService} from './session.service';

import {IOrderList} from '../interfaces/i-order-list';
import {DEFAULT_LANG} from '../constants';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class GeneralService {
  private _homeSlug = 'home';
  private _homeId = 1;
  private _orderList: IOrderList[] = [
    {
      name: 'CUSTOM',
      cat: '',
      faq: ''
    },
    {
      name: 'NAME_ASC',
      cat: 'name',
      faq: 'question'
    },
    {
      name: 'NAME_DESC',
      cat: '-name',
      faq: '-question'
    },
    {
      name: 'AUTHOR_ASC',
      cat: 'author',
      faq: 'author'
    },
    {
      name: 'AUTHOR_DESC',
      cat: '-author',
      faq: '-author'
    },
    {
      name: 'LAST_CREATED',
      cat: '-created_at',
      faq: '-created_at'
    },
    {
      name: 'LAST_UPDATED',
      cat: '-updated_at',
      faq: '-updated_at'
    },
  ];
  public _kbName = 'MyAnswers kennisbanksoftware';
  public _prevTitle = null;
  private _defaultHomeCategory = {
    'id': this.homeId,
    'parent_id': 0,
    'name': 'Home',
    'slug': this.homeSlug,
    'parent_slug': null,
    'sort_order': 0,
    'lang': {
      'code': 'en',
      'name': 'en'
    },
    'author': null,
    'created_at': 0,
    'updated_at': 0,
    'granted_access': [],
    'visibility': 'public',
    'allowed_visibilities': [
      {'code': 'public', 'name': 'Public'},
      {'code': 'internal', 'name': 'Internal'},
      {'code': 'private', 'name': 'Private'}
    ],

    'type': 'home',
    'language': {
      'code': 'en',
      'name': 'en'
    },
    'hierarchical': {
      'lvl0': null,
      'lvl1': null,
      'lvl2': null
    }
  };

  constructor(private $Router: Router,
              private $Title: Title,
              private $Injector: Injector,
              private $Session: SessionService) {
  }

  private get $Translate(): TranslateService {
    return this.$Injector.get(TranslateService)
  }

  get homeSlug(): string {
    return this._homeSlug
  };

  get homeId(): number {
    return this._homeId
  };

  get defaultHome() {
    return this._defaultHomeCategory;
  }

  get orderList(): IOrderList[] {
    return this._orderList
  };

  get isAdminPanel(): boolean {
    return /^\/admin/.test(this.$Router.url);
  }

  addSpecStyle(styleObject) {
    let style = '';
    let styleNode: HTMLStyleElement = document.createElement('style');

    if (!Array.isArray(styleObject)) {
      styleObject = [styleObject];
    }

    styleObject.forEach((item) => {
      let hasSelector = typeof item.selector === 'string' && !!item.selector.length;
      let hasStyles = typeof item.styles === 'object' && item.styles !== null;
      if (!hasSelector || !hasStyles) {
        return;
      }

      style = `${style} ${item.selector} { `;

      for (let key in item.styles) {
        style = `${style} ${key}: ${item.styles[key]};`
      }
      style = `${style} }`;
    });

    styleNode.type = 'text/css';
    styleNode.textContent = style;
    document.head.appendChild(styleNode);
  };

  redirectToSubdomain(subdomain: string): void {
    let token = `t=${this.$Session.token.data}`;
    this.$Session.token.remove();
    this.$Session.subdomain.remove();
    window.location.href = `${IS_LOCAL ? 'http' : 'https'}://${subdomain}.${MAIN_DOMAIN}/redirecting?${token}`;
  }

  setFavicon(iconUrl: string | boolean) {
    iconUrl = iconUrl || 'favicon.ico';
    let link = document.createElement('link');
    let oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.type = 'image/x-icon';
    link.href = <string>iconUrl;
    if (oldLink) {
      document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
  }

  setPageTitle(title?: string) {
    this._prevTitle = title;
    let siteTitle = '';
    if (this.isAdminPanel) {
      siteTitle = `Admin panel${ this._kbName === 'Home' ? `` : ` for ${this._kbName}` }`
    } else {
      siteTitle = `${this._prevTitle ? `${this._prevTitle} ` : ``}`;
      if (this._kbName) {
        siteTitle = `${this._prevTitle ? `${this._prevTitle} - ` : ``}${this._kbName}`;
      }
    }
    this.$Title.setTitle(siteTitle);
  }

  getCurrentSlugByParams(params: ParamMap): string {
    return params.get('subcategorySlug') || params.get('categorySlug') || this._homeSlug;
  };

  getHeadersSubdomain(subdomain: string): RequestOptionsArgs {
    let options = {};

    if (subdomain) {
      let headers = new Headers();
      headers.append('Client-Subdomain', subdomain);
      options = {headers}
    }

    return options;
  }

  getHeadersLang(lang: string): RequestOptionsArgs {
    let options = {};

    if (lang) {
      let headers = new Headers();
      headers.append('Accept-Language', lang);
      options = {headers}
    }

    return options;
  }

  getOptionsForMostViewedFaq(params, lang): RequestOptions {
    let myHeaders = new Headers({
      'Accept-Language': lang
    });
    let myParams = new URLSearchParams();
    myParams.append('categoryId', params.categoryId);
    myParams.append('period', params.period);
    let options = new RequestOptions();
    options.headers = myHeaders;
    options.params = myParams;
    return options;
  }

  setLanguage(settingLang: string, lang: string = null) {
    if (this.isAdminPanel) {
      this.$Translate.use(settingLang || DEFAULT_LANG);
    } else {
      this.$Translate.use(lang || DEFAULT_LANG);
    }
  }

  unique(arr) {
    let result = [];

    nextInput:
      for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        for (let j = 0; j < result.length; j++) {
          if (result[j] === str) {
            continue nextInput;
          }
        }
        result.push(str);
      }

    return result;
  };
}
