import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { SettingService } from '../../services/setting.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

import { IDepartment } from '../../interfaces/i-department';
import { ICommonSettings } from '../../interfaces/i-common-settings';
import { EMAIL_PATTERN } from '../../constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPasswordModalComponent } from '../../modals/confirm-password-modal/confirm-password-modal.component';
import { TreeService } from '../../services/tree.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ma-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  personalInfoForm: FormGroup;
  newtoken: string;
  departments: Observable<IDepartment[]>;
  disablebtn = false;
  currentSubdomain: string;
  newpassword: string;
  oldEmail: string;
  private _userSub: AnonymousSubscription;

  constructor(private $Setting: SettingService,
              private $Auth: AuthService,
              private $Users: UsersService,
              private $Toast: ToastService,
              private $Session: SessionService,
              private $Tree: TreeService,
              private $modal: NgbModal) {
    this.departments = this.$Setting.commonSettings.map((res: ICommonSettings) => res.departments)
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;
    this.oldEmail = this.$Auth.user.email;
    this.personalInfoForm = new FormGroup({
      id: new FormControl(null),
      first_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]),
      department: new FormControl(this.$Auth.user.department, [
        Validators.required
      ]),
      role: new FormControl(null, []),
      roleName: new FormControl(null, [])
    });

    this.$Auth.getCurrentUser()
      .then(() => {
        this.personalInfoForm.patchValue(this.$Auth.user);
      });
  }

  ngOnDestroy() {
    if (this._userSub) {
      this._userSub.unsubscribe();
    }
  }

  submit() {
    if (this.personalInfoForm.getRawValue().email !== this.$Auth.user.email && !this.newtoken) {
      this.$Toast.errorOne(`PERSONAL_INFO.CONFIRM_PASSWORD`);
    } else {
      if (this.personalInfoForm.getRawValue().department === 'Please choose a role') {
        this.$Toast.error(`PERSONAL_INFO.CHOOSE_ROLE`);
      } else {
        this.$Users.update(this.personalInfoForm.getRawValue())
          .then((result) => {
            if (this.personalInfoForm.getRawValue().email !== this.oldEmail) {
              let loginData = {
                password: this.newpassword,
                email: this.personalInfoForm.getRawValue().email,
                subdomain: this.currentSubdomain
              };
              this.$Auth.removeUser();
              this.$Auth.login(loginData)
                .then(() => {
                  return this.$Setting.getKBSettings();
                })
                .then(() => {
                  this.$Auth.updateCurrentUser();
                  this.$Users.getAll();
                  this.$Tree.rebuildTree();
                })
                .catch((error) => {
                  this.$Toast.showServerErrors(error);
                });
            } else {
              this.$Auth.updateCurrentUser();
            }
            this.$Toast.success(`MESSAGES.PERSONAL_INFO_CHANGED`);
            this.personalInfoForm.reset(result);
            this.personalInfoForm.markAsUntouched();
          })
          .catch((error) => {
            if (error.json().errors[0].message === 'Sent invalid parameters') {
              this.$Toast.errorOne(`PERSONAL_INFO.EMAIL_REGISTERED`);
            } else {
              this.$Toast.showServerErrors(error);
            }
          });

      }
    }
  }

  confirmpassword() {
    let confirmPasswordModal = this.$modal.open(ConfirmPasswordModalComponent);
    confirmPasswordModal.componentInstance.email = this.$Auth.user.email;

    confirmPasswordModal.result
      .then(res => {
        this.newpassword = res.password;
        this.newtoken = res.access_token;
      }).catch((err) => {
      this.$Toast.errorOne(`PERSONAL_INFO.DO_NOT_CONFIRM_PASSWORD`);
      this.personalInfoForm.patchValue({email: this.$Auth.user.email});
    });
  }
}
