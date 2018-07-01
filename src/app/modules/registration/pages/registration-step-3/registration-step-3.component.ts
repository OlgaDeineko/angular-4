import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IRegistrSubdomainData } from '../../interfaces/i-registr-subdomain-data';
import { ToastService } from '../../../../services/toast.service';
import { SessionService } from '../../../../services/session.service';
import {ActivatedRoute, Router} from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ma-registration-step-3',
  templateUrl: './registration-step-3.component.html',
  styleUrls: ['./registration-step-3.component.scss']
})
export class RegistrationStep3Component implements OnInit {
  registrSubdomainForm: FormGroup;
  languages: string[] = ['English', 'Dutch'];
  choice = 'private';
  registrDataObject = {};
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

    this.registrDataObject = this.$Session.registrData.data;
    if (!(this.$Session.registrDataStep.data === 'success step 2')) {
      this.$Router.navigateByUrl('/');
      this.$Session.registrDataStep.remove();
      this.$Session.registrData.remove();
    }
    this.registrSubdomainForm = new FormGroup({
      subdomain: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      // language: new FormControl('English'),
    });
  }

  registerSubdomain() {
    let registrSubdomainData: IRegistrSubdomainData = this.registrSubdomainForm.getRawValue();

    this.$Register.registerStep3(registrSubdomainData)
      .then((result) => {
        this.registrDataObject['registrSubdomain'] = registrSubdomainData;
        this.registrDataObject['choice'] = this.choice;
        this.$Session.registrData.data = this.registrDataObject;
        this.$Session.registrDataStep.data = 'success step 3';
        if (this.ruteLang) {
          this.$Router.navigate([`${this.ruteLang}/step4`]);
        } else {
          this.$Router.navigate(['/step4']);
        }
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      });
  }
}
