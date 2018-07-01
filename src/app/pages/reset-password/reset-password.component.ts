import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';

// constants
import { PASSWORD_PATTERN } from '../../constants';

// directives
import { confirmPasswordValidator } from '../../directives/confirm-password.directive';

// services
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'ma-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy {

  resetPasswordForm: FormGroup;
  resetToken: string;

  private _routeParamsSub: AnonymousSubscription;

  constructor(private $Auth: AuthService,
              private $Toast: ToastService,
              private $Router: Router,
              private $Route: ActivatedRoute) {
    $Auth.logOut(false);

    this._routeParamsSub = this.$Route.queryParamMap
      .subscribe(res => {
        this.resetToken = res.get('resetToken');
        if (this.resetToken) {
          this.resetPasswordForm = new FormGroup({
            password: new FormControl('', [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(PASSWORD_PATTERN)
            ]),
            password_repeat: new FormControl('', [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(PASSWORD_PATTERN),
              confirmPasswordValidator('password')
            ]),
          });
        } else {
          this.$Router.navigateByUrl('/');
        }
      });
  }


  ngOnDestroy() {
    this._routeParamsSub.unsubscribe();
  }

  submit() {
    this.$Auth.resetPassword(this.resetToken, this.resetPasswordForm.get('password').value)
      .then(res => {
        this.$Toast.success('MESSAGES.PASSWORD_CHANGED');
        this.$Router.navigateByUrl('/login');
      })
      .catch(err => {
        this.$Toast.showServerErrors(err);
      })
  }
}
