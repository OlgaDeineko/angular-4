import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IRegistrPersonalInfoData} from '../../interfaces/i-registr-personal-info-data';
import {ToastService} from '../../../../services/toast.service';
import {SessionService} from '../../../../services/session.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RegistrationService} from '../../services/registration.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ma-registration-step-2',
  templateUrl: './registration-step-2.component.html',
  styleUrls: ['./registration-step-2.component.scss']
})
export class RegistrationStep2Component implements OnInit {
  registrPersonalInfoForm: FormGroup;
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
    if (!(this.$Session.registrDataStep.data === 'success step 1')) {
      this.$Router.navigateByUrl('/');
      this.$Session.registrDataStep.remove();
      this.$Session.registrData.remove();
    }
    this.registrPersonalInfoForm = new FormGroup({
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      phone: new FormControl('', []),
    });
  }

  registerPerson() {
    let registrPersonalInfoData: IRegistrPersonalInfoData = this.registrPersonalInfoForm.getRawValue();

    this.$Register.registerStep2(registrPersonalInfoData)
      .then((result) => {
        this.registrDataObject['registrPersonalInfo'] = registrPersonalInfoData;
        this.$Session.registrData.data = this.registrDataObject;
        this.$Session.registrDataStep.data = 'success step 2';
        if (this.ruteLang) {
          this.$Router.navigate([`${this.ruteLang}/step3`]);
        } else {
          this.$Router.navigate(['/step3']);
        }
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }
}
