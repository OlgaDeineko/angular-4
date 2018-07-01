import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import {AnonymousSubscription} from 'rxjs/Subscription';

import {SettingService} from '../../services/setting.service';
import {UsersService} from '../../services/users.service';
import {ToastService} from '../../services/toast.service';
import {AuthService} from '../../services/auth.service';

import {IRoles} from '../../interfaces/i-roles';
import {ICommonSettings} from '../../interfaces/i-common-settings';
import {ISubdomainInfo} from '../../interfaces/i-subdomain-info';
import {IUserNew} from '../../interfaces/i-user-new';
import {ISubdomainsInfoResponce} from '../../interfaces/i-subdomains-info-responce';
import {EMAIL_PATTERN} from '../../constants';

@Component({
  selector: 'ma-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  editUserForm: FormGroup;

  subdomains: Observable<ISubdomainInfo[]>;
  ownerId: string;
  roles: Observable<IRoles[]>;
  user: IUserNew;
  isOwner = false;
  isSuperAdmin = false;
  private _ownerSub: AnonymousSubscription;

  constructor(public $Modal: NgbActiveModal,
              public $Setting: SettingService,
              private $Users: UsersService,
              private $Auth: AuthService,
              private $Toast: ToastService) {
    this.subdomains = this.$Setting.subdomains.map((res: ISubdomainsInfoResponce) => res.subdomains);
  }

  ngOnInit() {
    if (this.$Setting.subdomains.getValue().subdomains.length === 0) {
      this.$Setting.getSubdomains()
    }

    this._ownerSub = this.$Setting.subdomains
      .map((res: ISubdomainsInfoResponce) => res.owner_id)
      .subscribe(ownerId => {
        this.isOwner = ownerId === this.$Auth.getId();
        this.isSuperAdmin = 'Super Admin' === this.$Auth.getRole();
        if (this.isOwner || (!this.isOwner && this.isSuperAdmin)) {
          this.roles = this.$Setting.commonSettings.map((res: ICommonSettings) => res.roles);
        } else {
          this.roles = this.$Setting.commonSettings
            .map((res: ICommonSettings) => res.roles.filter(role => role.code !== 'admin'));
        }
      });
    this.editUserForm = new FormGroup({
      id: new FormControl(this.user.id || null),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]),
      first_name: new FormControl(this.user.first_name, [
        Validators.required,
        Validators.minLength(3)
      ]),
      last_name: new FormControl(this.user.last_name, [
        Validators.required,
        Validators.minLength(3)
      ]),
      role: new FormControl(this.user.roleName, [
        Validators.required
      ]),
      shared_subdomains: new FormControl(null)
    });

    this.$Users.getUserSubdomains(this.user.id).then((subdomains) => {
      this.user.subdomains = subdomains;
      this.editUserForm.patchValue({shared_subdomains: this.user.subdomains.map(s => s.db_index)})
    })
  }

  ngOnDestroy() {
    this._ownerSub.unsubscribe();
  }

  save() {
    this.$Users.update(this.editUserForm.getRawValue())
      .then((res) => {
        this.$Users.getAll();
        this.$Auth.updateCurrentUser();
        this.$Toast.success(`MESSAGES.USER_UPDATE`);
        this.$Modal.close(res);
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }

  isDisabledSubdomains(subdomain: ISubdomainInfo) {
    if (this.user.id === this.ownerId) {
      return true;
    }
    return subdomain.parent_site_id === null;
  }
}
