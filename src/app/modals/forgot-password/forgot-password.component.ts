import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { EMAIL_PATTERN } from '../../constants';

@Component({
  selector: 'ma-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  email: string;

  constructor(public $Modal: NgbActiveModal,
              private $Auth: AuthService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this.forgotForm = new FormGroup({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ])
    });
  }

  send() {
    this.$Auth.forgotPassword(this.forgotForm.getRawValue())
      .then(() => {
        this.$Toast.success('MESSAGES.EMAIL_SENT');
        this.$Modal.close();
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }
}
