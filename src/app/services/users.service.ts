import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UrlService } from './url.service';
import { GeneralService } from './general.service';

import { IUserResponse } from '../interfaces/i-user-response';
import { IUserResponseFull } from '../interfaces/i-user-response-full';
import { IUser } from '../interfaces/i-user';
import { IUserNew } from '../interfaces/i-user-new';
import { ICategoryResponse } from '../interfaces/i-category-response';
import { IFaqResponse } from '../interfaces/i-faq-response';
import { IGroup } from '../interfaces/i-group';
import { ISubdomainInfo } from '../interfaces/i-subdomain-info';
import { toPromise } from 'rxjs/operator/toPromise';
import { IPermittedResources } from '../interfaces/i-group-permitted-resources';

@Injectable()
export class UsersService {
  private _user: BehaviorSubject<IUser[]>;
  private _groups: BehaviorSubject<IGroup[]>;
  private _userSubdomains: BehaviorSubject<ISubdomainInfo[]>;
  private _groupPermittedResources: BehaviorSubject<IPermittedResources>;
  private _userPermittedResources: BehaviorSubject<IPermittedResources>;

  constructor(private $Url: UrlService,
              private $General: GeneralService,
              private $http: Http) {
    this._user = new BehaviorSubject([]);
    this._userSubdomains = new BehaviorSubject([]);
    this._groups = new BehaviorSubject([]);
    this._groupPermittedResources = new BehaviorSubject(null);
    this._userPermittedResources = new BehaviorSubject(null);
  }

  get user(): BehaviorSubject<IUser[]> {
    return this._user
  }

  get userSubdomains(): BehaviorSubject<ISubdomainInfo[]> {
    return this._userSubdomains
  }

  get groups(): BehaviorSubject<IGroup[]> {
    return this._groups
  }
  get groupPermittedResources(): BehaviorSubject<IPermittedResources> {
    return this._groupPermittedResources
  }

  get userPermittedResources(): BehaviorSubject<IPermittedResources> {
    return this._userPermittedResources
  }

  dataToRequest(user) {
    user.role = user.role || user.roleName;
    if (Array.isArray(user.role)) {
      user.role = user.role[0];
    }
    return user
  };

  groupresponseToData(group, usersArrary) {
    group.users = [];
    usersArrary.forEach((u) => {
      if (group.user_ids.indexOf(u.id) > -1) {
        group.users.push(u);
      }
    });
    return group
  }

  responseToData(user: IUserResponse | IUserResponseFull): IUser {
    let preparedData: IUser = {
      id: user.id,
      status: user.status,
      role: user.role,
      email: user.email,
      phone: user.phone,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      subdomains: user.subdomains,
      department: user.department,
      group_id: user.group_id,
      created_at: user.created_at,
      fullName: '',
      roleName: ''
    };

    preparedData.fullName = `${user.first_name} ${user.last_name}`;
    preparedData.roleName = (user.role || [])[0];
    return preparedData
  }

  getNewUser(): IUserNew {
    return {
      roleName: 'editor',
      email: '',
      first_name: '',
      last_name: '',
      group_id: null,
      department: '',
      subdomains: []
    }
  }

  getNewGroup() {
    return {
      name: '',
      user_ids: [],
      subdomains: [],
      permitted_resources: {
        categories: [],
        faq: []
      },
    }
  }

  getAll(subdomain: string = null): Promise<any> {
    return this.$http.get(`${this.$Url.apiUrl}/users`, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data.map(this.responseToData) as IUser[])
      .toPromise()
      .then((result) => {
        this._user.next(result);
        return result
      })
  }

  create(user: IUser) {
    return this.$http.post(`${this.$Url.apiUrl}/users`, this.dataToRequest(user))
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((res) => {
        this.getAll();
        return res;
      });
  };

  update(user: IUser, subdomain: string = null) {
    return this.$http.put(`${this.$Url.apiUrl}/users/${user.id}`, this.dataToRequest(user), this.$General.getHeadersSubdomain(subdomain))
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((res) => {
        return res;
      });
  };

  getUserPermittedResources(id, lang: string = null) {
    return this.$http.get(`${this.$Url.apiUrl}/users/${id}/resources`, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
      .toPromise()
      .then( (res) => {
          this._userPermittedResources.next(res);
          return res;
        }
      )
  }

  remove(id: number) {
    return this.$http.delete(`${this.$Url.apiUrl}/users/${id}`)
      .toPromise()
      .then((res) => {
        this.getAll();
        return res;
      });
  };

  disable(user: IUser) {
    return this.$http.post(`${this.$Url.apiUrl}/users/${user.id}/disable`, this.dataToRequest(user))
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((res) => {
        this.getAll();
        return res;
      });
  };

  enable(user: IUser) {
    return this.$http.post(`${this.$Url.apiUrl}/users/${user.id}/enable`, this.dataToRequest(user))
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((res) => {
        this.getAll();
        return res;
      });
  };

  getOtherSubdomainData(subdomain: string = null): Promise<[ICategoryResponse[], IFaqResponse[]]> {
    return Promise.all([
      this.$http.get(`${this.$Url.apiUrl}/categories?skip_language=true`, this.$General.getHeadersSubdomain(subdomain))
        .map(res => res.json().data)
        .toPromise(),
      this.$http.get(`${this.$Url.apiUrl}/faq?skip_language=true`, this.$General.getHeadersSubdomain(subdomain))
        .map(res => res.json().data)
        .toPromise(),
    ])
  }

  getById(userId: string, subdomain: string = null): Observable<IUser> {
    return this.$http.get(`${this.$Url.apiUrl}/users/${userId}`, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data)
  }

  getUserSubdomains(userId: string, subdomain: string = null): Promise<ISubdomainInfo[]> {
    return this.$http.get(`${this.$Url.apiUrl}/users/${userId}/subdomains`, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data)
      .toPromise()
      .then((res) => {
        this._userSubdomains.next(res);
        return res
      })
  }

  fetchuser(email: string, subdomain: string = null): Promise<IUser> {
    return this.$http.get(`${this.$Url.apiUrl}/users/${email}`, this.$General.getHeadersSubdomain(subdomain))
      .map(res => res.json().data)
      .toPromise()
  }

  getGroups(lang: string = null) {
    return this.$http.get(`${this.$Url.apiUrl}/groups`, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
      .toPromise()
      .then((res) => {
        res.forEach((group) => {
          group = this.groupresponseToData(group, this._user.getValue())
        });
        let groups = res;
        this._groups.next(groups);
      })
  }

  getGroup(id, lang: string = null): Observable<IGroup> {
    return this.$http.get(`${this.$Url.apiUrl}/groups/${id}`, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
  }

  getGroupPermittedResources(id, lang: string = null) {
    return this.$http.get(`${this.$Url.apiUrl}/groups/${id}/resources`, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
      .toPromise()
      .then( (res) => {
        this._groupPermittedResources.next(res);
        return res;
        }
      )
  }

  updateGroup(group, lang: string = null) {
    return this.$http.put(`${this.$Url.apiUrl}/groups/${group.id}`, group, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
      .toPromise()
      .then((res) => {
        this.getGroups(lang);
        this.getAll();
        return res;
      });
  }
  updateGroupPermittedResources(id, resources, lang: string = null) {
    return this.$http.put(`${this.$Url.apiUrl}/groups/${id}/resources`, resources, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
      .toPromise()
      .then((res) => {
        return res;
      });
  }

  createGroup(group, lang: string = null) {
    return this.$http.post(`${this.$Url.apiUrl}/groups`, group, this.$General.getHeadersLang(lang))
      .map(res => res.json().data)
      .toPromise()
      .then((res) => {
        this.getGroups(lang);
        this.getAll();
        return res;
      });
  }

  removeGroup(id: number) {
    return this.$http.delete(`${this.$Url.apiUrl}/groups/${id}`)
      .toPromise()
      .then((res) => {
        this.getGroups();
        this.getAll();
        return res;
      });
  }
}
