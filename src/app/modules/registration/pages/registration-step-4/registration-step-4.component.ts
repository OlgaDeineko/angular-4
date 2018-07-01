import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// constants
import {API_DOMAIN} from '../../../../../environments/environment';
// interfaces
import {IRegistrData} from '../../interfaces/i-registr-data';
// services
import {ToastService} from '../../../../services/toast.service';
import {SessionService} from '../../../../services/session.service';
import {RegistrationService} from '../../services/registration.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ma-registration-step-4',
  templateUrl: './registration-step-4.component.html',
  styleUrls: ['./registration-step-4.component.scss']
})
export class RegistrationStep4Component implements OnInit {
  registrEmailData;
  registrPersonalInfoData;
  registrSubdomainData;
  choice: string;
  userURL: string;
  languages: string[] = ['English', 'Dutch'];
  messageAfterRegister = false;
  messageRegisterDone = false;
  registremail: string;
  ruteLang: string;
  private _routeSub: AnonymousSubscription;

  constructor(private $Register: RegistrationService,
              private $Router: Router,
              private $Route: ActivatedRoute,
              private $Translate: TranslateService,
              private $Session: SessionService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this._routeSub = this.$Route.paramMap
      .subscribe(res => {
        let param: any = res;
        if (param.params.lang) {
          this.ruteLang = param.params.lang;
        } else {
          this.$Translate.setDefaultLang('nl');
          this.$Translate.use('nl');
        }
      });

    if (!(this.$Session.registrDataStep.data === 'success step 3')) {
      this.$Router.navigateByUrl('/');
      this.$Session.registrDataStep.remove();
      this.$Session.registrData.remove();
    } else {
      this.registrEmailData = this.$Session.registrData.data.registrEmail;
      this.registrEmailData.email = atob(this.registrEmailData.email);
      this.registrEmailData.password = atob(this.registrEmailData.password);
      this.registrPersonalInfoData = this.$Session.registrData.data.registrPersonalInfo;
      this.registrSubdomainData = this.$Session.registrData.data.registrSubdomain;
      this.choice = this.$Session.registrData.data.choice;
      this.userURL = `https://${this.registrSubdomainData.subdomain}.${API_DOMAIN}`;
    }
  }

  registerstep4() {
    if (this.messageAfterRegister === false) {
      let registrData: IRegistrData = Object.assign(
        {},
        this.registrEmailData,
        this.registrPersonalInfoData,
        this.registrSubdomainData
      );
      registrData.settings = {
        'accessibility': `${this.choice}`
      };
      if (this.ruteLang) {
        registrData.settings['language'] = this.ruteLang;
      } else {
        registrData.settings['language'] = 'nl';
      }

      this.registremail = registrData.email;

      this.$Register.registerStep4(registrData)
        .then((result) => {
          this.$Session.registrDataStep.remove();
          this.$Session.registrData.remove();
          this.messageAfterRegister = true;
          this.messageRegisterDone = true;
        })
        .catch((error) => {
          this.$Toast.showServerErrors(error);
        });
    } else {
      this.messageRegisterDone = false;
      this.$Toast.success(`MESSAGES.REGISTRATION_DONE_ACTIVATE`);
    }
  }

  closeMessageRegisterDone() {
    this.messageRegisterDone = false;
  }
}
