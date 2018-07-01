import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { UrlService } from '../../../services/url.service';

import { IRegistrEmailData } from '../interfaces/i-registr-email-data';
import { IRegistrPersonalInfoData } from '../interfaces/i-registr-personal-info-data';
import { IRegistrSubdomainData } from '../interfaces/i-registr-subdomain-data';
import { IRegistrData } from '../interfaces/i-registr-data';

@Injectable()
export class RegistrationService {

  constructor(private $Url: UrlService,
              private $http: Http) {
  }

  registerStep1(newUser: IRegistrEmailData) {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/register/step-1`, newUser)
      .toPromise()
  };

  registerStep2(newUser: IRegistrPersonalInfoData) {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/register/step-2`, newUser)
      .toPromise()
  };

  registerStep3(newUser: IRegistrSubdomainData) {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/register/step-3`, newUser)
      .toPromise()
  };

  registerStep4(newUser: IRegistrData) {
    return this.$http
      .post(`${this.$Url.apiUrl}/auth/register/step-4`, newUser)
      .toPromise()
  };
}
