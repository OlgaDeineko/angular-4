import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { UrlService } from './url.service';
import { SessionService } from './session.service';
import { UsersService } from './users.service';

import { IUserResponse } from '../interfaces/i-user-response';
import { IUser } from '../interfaces/i-user';
import { IUserResponseFull } from '../interfaces/i-user-response-full';
import { ILoginData } from '../interfaces/i-login-data';
import { ISubdomainInfo } from '../interfaces/i-subdomain-info';
import { IMaWindow } from '../interfaces/i-ma-window';

@Injectable()
export class AuthService {
  user: IUser;
  _userIsChanged: Subject<number> = new Subject();

  constructor(private $Url: UrlService,
              private $http: Http,
              private $Session: SessionService,
              private $Users: UsersService) {
  }

  get userIsChanged(): Subject<number> {
    return this._userIsChanged;
  }

  login(loginData: ILoginData): Promise<IUserResponseFull> {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/login`, loginData)
      .map(res => res.json().data as IUserResponseFull)
      .toPromise()
      .then(res => {
        this.$Session.token.data = res.access_token;
        this.$Session.token.setExpiry(res.expire_in);
        this.user = this.$Users.responseToData(res);
        this.identifyAppcues();
        (window as IMaWindow).Appcues.start();
        return res;
      })
  };

  logOut(neededRedirect: boolean = true): void {
    this.$Session.token.remove();
    this.removeUser();
    if (neededRedirect) {
      window.location.href = '/';
    }
  };

  getFullName(): string {
    return this.userIsLoaded() ? `${this.user.first_name} ${this.user.last_name}` : null;
  };

  getToken(): string {
    return this.$Session.token.data;
  };

  getRole(): string {
    return this.userIsLoaded() ? this.user.roleName : null;
  };

  getId(): string {
    return this.userIsLoaded() ? this.user.id : null;
  };

  getEmail(): string {
    return this.userIsLoaded() ? this.user.email : null;
  };

  isLogin(): boolean {
    return !!this.getToken();
  };

  userIsLoaded(): boolean {
    return !!this.user;
  };

  getSubdomains(): ISubdomainInfo[] {
    return this.userIsLoaded() ? this.user.subdomains : null;
  }

  getCreated(): string {
    return this.userIsLoaded() ? this.user.created_at : null;
  };

  getCurrentUser(): Promise<IUser> {
    if (this.userIsLoaded()) {
      return new Promise(resolve => {
        resolve(this.user);
      })
    } else {
      return this.updateCurrentUser();
    }
  };

  updateCurrentUser(): Promise<IUser> {
    return this.$http
      .get(`${this.$Url.apiUrl}/users/me`)
      .map(res => res.json().data as IUserResponse)
      .toPromise()
      .then(res => {
        this.user = this.$Users.responseToData(res);
        this._userIsChanged.next(1);
        this.identifyAppcues();
        (window as IMaWindow).Appcues.start();
        return this.user;
      });
  }

  removeUser(): void {
    this.user = null;
  }

  private _identifyFS(): void {
    if (this.user && window.hasOwnProperty('FS')) {
      (window as IMaWindow).FS.identify(this.getId(), {
        displayName: this.getFullName(),
        email: this.getEmail()
      });
    }
  };

  identifyAppcues(): void {
    if (this.user && window.hasOwnProperty('Appcues')) {
      (window as IMaWindow).Appcues.identify(this.getId(), {
        name: this.getFullName(),
        email: this.getEmail(),
        created_at: Date.parse(this.getCreated()) / 1000,
      });
    }
  };

  /**
   * reIdentify third party web services (ex.: Appcues, FullStory)
   * @description some third party services needed reIdentify after change url or in others place.
   * all logic for identify needed realise in others functions (ex.: _identifyFS)
   */
  reIdentifyWebServices(): void {
    this._identifyFS();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////

  hasPermission(roles: string[]): boolean {
    let isHavePermission = false;
    roles.forEach(item => {
      switch (item) {
        case 'editor':
          if (this.getRole() === 'editor') {
            isHavePermission = true;
          }
          break;
        case 'admin':
          if (this.getRole() === 'admin') {
            isHavePermission = true;
          }
          break;
        case 'visitor':
          if (this.getRole() === 'visitor') {
            isHavePermission = true;
          }
          break;
        case 'superAdmin':
          if (this.getRole() === 'Super Admin') {
            isHavePermission = true;
          }
          break;
        case 'contributor':
          if (this.getRole() === 'contributor') {
            isHavePermission = true;
          }
          break;
      }
    });
    return isHavePermission;
  }

  forgotPassword(email: string): Promise<any> {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/requestPasswordReset`, email)
      .toPromise();
  };

  resetPassword(hash: string, pass: string): Promise<any> {
    return this.$http
      .post(
        `${this.$Url.apiUrl}/auth/resetPassword?resetToken=${hash}`,
        {'new_password': pass}
      )
      .toPromise();
  };

  sendActivation(hash: string, tag: string, secret: string): Promise<any> {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/verifyEmail?token=${hash}`, {
        'tag': tag,
        'secret': secret
      })
      .map(res => res.json().data)
      .toPromise();
  };

  changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return this.$http
      .post(`${this.$Url.apiUrl}/users/${this.getId()}/change-password`, {
        oldPassword,
        newPassword
      })
      .toPromise();
  };
}
