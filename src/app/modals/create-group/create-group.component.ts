import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISubdomainsInfoResponce} from '../../interfaces/i-subdomains-info-responce';
import {ISubdomainInfo} from '../../interfaces/i-subdomain-info';
import {Observable} from 'rxjs/Observable';
import {UsersService} from '../../services/users.service';
import {SettingService} from '../../services/setting.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../services/toast.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {IGroup} from '../../interfaces/i-group';

@Component({
  selector: 'ma-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit, OnDestroy {
  createGroupForm: FormGroup;

  subdomains: Observable<ISubdomainInfo[]>;

  group: IGroup;
  users: any;
  usersInGroup: string[];
  owner: string;

  private _usersSub: AnonymousSubscription;
  private _subdomainsSub: AnonymousSubscription;

  constructor(public $Modal: NgbActiveModal,
              public $Setting: SettingService,
              private $Users: UsersService,
              private $Toast: ToastService) {
    this.subdomains = this.$Setting.subdomains.map((res: ISubdomainsInfoResponce) => res.subdomains);
  }

  ngOnInit() {
    this._subdomainsSub = this.subdomains.subscribe((res) => {
      res.forEach((sub) => {
        if (sub.parent_site_id === null) {
          this.group.subdomains.push(sub)
        }
      });
    });

    if (this.$Setting.subdomains.getValue().subdomains.length === 0) {
      this.$Setting.getSubdomains()
    }

    this._usersSub = this.$Users.user.subscribe((users) => {
      this.users = this.prepareUsers(users);
      this.usersInGroup = this.group.user_ids;
    });

    this.createGroupForm = new FormGroup({
      name: new FormControl(this.group.name, [
        Validators.required,
      ]),
      shared_subdomains_indexes: new FormControl(this.group.subdomains.map(s => s.db_index)),
      user_ids: new FormControl(this.usersInGroup, [
        Validators.required,
      ]),
      permitted_resources: new FormControl(this.group.permitted_resources)
    });

  }

  save() {
    if (!this.createGroupForm.getRawValue().name || this.createGroupForm.getRawValue().user_ids.length < 1) {
      if (!this.createGroupForm.getRawValue().name) {
        this.$Toast.error('VALIDATION_ERRORS.GROUP_NO_NAME');
      }
      if (this.createGroupForm.getRawValue().user_ids.length < 1) {
        this.$Toast.error('VALIDATION_ERRORS.GROUP_NO_USERS');
      }
      return;
    }
    if (this.users.length < 1) {
      this.$Toast.error('MESSAGES.CANNOT_CREATE_GROUP');
      return;
    }
    this.$Users.createGroup(this.createGroupForm.getRawValue())
      .then((res) => {
        this.$Users.getGroups();
        this.$Toast.success(`MESSAGES.GROUP_CREATE`);
        this.$Modal.close(res);
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }

  ngOnDestroy() {
    this._usersSub.unsubscribe();
    this._subdomainsSub.unsubscribe();
  }

  prepareUsers(users) {
    let user = [];
    users.forEach((u) => {
      if (!u.group_id && u.id !== this.owner) {
        user.push({value: u.id, label: u.fullName})
      }
    });

    return user

  }

  isDisabledSubdomains(subdomain: ISubdomainInfo) {
    return subdomain.parent_site_id === null;
  }
}
