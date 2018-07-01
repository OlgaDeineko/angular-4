import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../../services/setting.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ILoginData } from '../../interfaces/i-login-data';
import { SessionService } from '../../services/session.service';
import { TreeService } from '../../services/tree.service';
import { Router } from '@angular/router';
import { IUserResponseFull } from '../../interfaces/i-user-response-full';

@Component({
  selector: 'ma-confirm-password-modal',
  templateUrl: './confirm-password-modal.component.html',
  styleUrls: ['./confirm-password-modal.component.scss']
})
export class ConfirmPasswordModalComponent implements OnInit {
  confirmPasswordForm: FormGroup;
  email: string;
  currentSubdomain: string;
  loginDATA: IUserResponseFull;

  constructor(public $Modal: NgbActiveModal,
              private $Auth: AuthService,
              private $Toast: ToastService,
              private $Session: SessionService,
              private $Tree: TreeService,
              private $Router: Router,
              private $Setting: SettingService) {
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;

    this.confirmPasswordForm = new FormGroup({
      email: new FormControl(this.email, [
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

  submit() {
    let loginData: ILoginData = this.confirmPasswordForm.getRawValue();
    loginData.subdomain = this.currentSubdomain;
    this.$Auth.removeUser();
    this.$Auth.login(loginData)
      .then((res) => {
      res['password'] = this.confirmPasswordForm.getRawValue().password;
        this.loginDATA = res;
      return this.$Setting.getKBSettings();
    })
      .then(() => {
        this.$Tree.rebuildTree();
        if (this.$Modal) {
          this.$Modal.close(this.loginDATA);
        } else {
          this.$Router.navigate(['']);
        }
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      });
  }
}
