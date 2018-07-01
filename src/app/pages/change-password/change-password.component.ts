import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../directives/confirm-password.directive';
import { PASSWORD_PATTERN } from '../../constants';

@Component({
  selector: 'ma-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('changePasswordFormElement') changePasswordFormElement: FormGroupDirective;

  changePasswordForm: FormGroup;

  constructor(private $Toast: ToastService,
              private $Auth: AuthService) {
  }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN),
        confirmPasswordValidator('newPassword')
      ]),
    });
  }

  submit() {
    let form = this.changePasswordForm.getRawValue();
    this.$Auth.changePassword(form.oldPassword, form.newPassword)
      .then(() => {
        this.$Toast.success(`MESSAGES.PASSWORD_CHANGED`);
        this.changePasswordForm.reset();
        this.changePasswordFormElement.resetForm();
      })
      .catch((err) => {
        this.$Toast.showServerErrors(err);
      });
  }
}
