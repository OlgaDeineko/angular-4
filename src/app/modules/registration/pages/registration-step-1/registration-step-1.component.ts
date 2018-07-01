import {Component, OnInit} from '@angular/core';
import {EMAIL_PATTERN, PASSWORD_PATTERN} from '../../../../constants';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IRegistrEmailData} from '../../interfaces/i-registr-email-data';
import {ToastService} from '../../../../services/toast.service';
import {SessionService} from '../../../../services/session.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RegistrationService} from '../../services/registration.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ma-registration-step-1',
  templateUrl: './registration-step-1.component.html',
  styleUrls: ['./registration-step-1.component.scss']
})
export class RegistrationStep1Component implements OnInit {
  registrEmailForm: FormGroup;
  registrDataObject = {};
  ruteLang: string;
  private _routeSub: AnonymousSubscription;

  constructor(private $Register: RegistrationService,
              private $Router: Router,
              private $Session: SessionService,
              private $Route: ActivatedRoute,
              private $Translate: TranslateService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this._routeSub = this.$Route.paramMap
      .subscribe(res => {
        let param: any = res;
        if (param.params.lang) {
          this.ruteLang = param.params.lang;
          this.$Translate.setDefaultLang(param.params.lang);
          this.$Translate.use(param.params.lang);
        }
      });
    this.registrEmailForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ]),
    });
  }

  registerEmail() {
    let registrEmailData: IRegistrEmailData = this.registrEmailForm.getRawValue();

    this.$Register.registerStep1(registrEmailData)
      .then((result) => {
        registrEmailData.email = btoa(registrEmailData.email);
        registrEmailData.password = btoa(registrEmailData.password);
        this.registrDataObject['registrEmail'] = registrEmailData;
        this.$Session.registrData.data = this.registrDataObject;
        this.$Session.registrDataStep.data = 'success step 1';
        if (this.ruteLang) {
          this.$Router.navigate([`${this.ruteLang}/step2`]);
        } else {
          this.$Router.navigate(['/step2']);
        }
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }
}
