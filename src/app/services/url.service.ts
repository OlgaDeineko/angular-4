import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { API_URL, PROTOCOL, IS_LOCAL, API_DOMAIN, MAIN_DOMAIN } from '../../environments/environment';

import { SessionService } from './session.service';


@Injectable()
export class UrlService {

  private _params = {};
  private _noReturn = [
    'editFAQ',
    'viewFaq',
    'createFAQ',
    '404Page',
    'registration',
    'activate',
    'requestPasswordReset',
  ];
  private _currentUrl: { name: string, url: string } = null;


  constructor(private $Session: SessionService) {
  }

  get apiUrl(): string {
    let protocol: string = this.protocol;
    let host: string = this.host;
    if (IS_LOCAL || !!window.localStorage.getItem('build')) {
      protocol = PROTOCOL;
      host = this.host.replace(/localhost(:\d{4})?/, API_DOMAIN);
    }
    return `${protocol}//${host}${API_URL}`;
  }

  get subdomain(): string {
    return window.location.host.match(/[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/)[0];
  };

  get host(): string {
    return window.location.host;
  };

  get protocol(): string {
    return window.location.protocol;
  };

  get isMyanswersDomain(): boolean {
    return /((myanswers\.io)|(localhost))/.test(this.host);
  }

  setPreviousPage(rootRoute: ActivatedRoute, url: string) {
    let currentRoute: ActivatedRoute = rootRoute;

    if (this._currentUrl && this._noReturn.indexOf(this._currentUrl.name) === -1) {
      this.$Session.previousPage.data = this._currentUrl.url;
    }

    while (currentRoute.children[0] !== undefined) {
      currentRoute = currentRoute.children[0];
    }

    let currentName = currentRoute.snapshot.data.name;

    this._currentUrl = {
      url: url,
      name: currentName
    };
  }
}
