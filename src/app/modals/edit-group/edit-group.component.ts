import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { UsersService } from '../../services/users.service';
import { SettingService } from '../../services/setting.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ISubdomainsInfoResponce } from '../../interfaces/i-subdomains-info-responce';
import {IGroup} from '../../interfaces/i-group';

@Component({
  selector: 'ma-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit, OnDestroy {

  editGroupForm: FormGroup;

  subdomains: Observable<ISubdomainInfo[]>;

  group: IGroup;
  users: any;
  usersInGroup: string[];
  owner: string;

  private _usersSub: AnonymousSubscription;

  constructor(public $Modal: NgbActiveModal,
              public $Setting: SettingService,
              private $Users: UsersService,
              private $Toast: ToastService) {
    this.subdomains = this.$Setting.subdomains.map((res: ISubdomainsInfoResponce) => res.subdomains);
  }

  ngOnInit() {
    if (this.$Setting.subdomains.getValue().subdomains.length === 0) {
      this.$Setting.getSubdomains()
    }

    this._usersSub = this.$Users.user.subscribe((users) => {
      this.users = this.prepareUsers(users);
      this.usersInGroup = this.group.user_ids;
    });

    this.editGroupForm = new FormGroup({
      id: new FormControl(this.group.id || null),
      name: new FormControl(this.group.name, [
        Validators.required,
      ]),
      shared_subdomains_indexes: new FormControl(this.group.subdomains.map(s => s.db_index)),
      user_ids: new FormControl(this.usersInGroup),
      permitted_resources: new FormControl(this.group.permitted_resources)
    });

  }

  save() {
    if (!this.editGroupForm.getRawValue().name || this.editGroupForm.getRawValue().user_ids.length < 1) {
      if (!this.editGroupForm.getRawValue().name) {
        this.$Toast.error('VALIDATION_ERRORS.GROUP_NO_NAME');
      }
      if (this.editGroupForm.getRawValue().user_ids.length < 1) {
        this.$Toast.error('VALIDATION_ERRORS.GROUP_NO_USERS');
      }
      return;
    }
    if (this.users.length < 1) {
      this.$Toast.error('MESSAGES.CANNOT_CREATE_GROUP');
      return;
    }
    this.$Users.updateGroup(this.editGroupForm.getRawValue())
      .then((res) => {
        this.$Users.getGroups();
        this.$Toast.success(`MESSAGES.GROUP_UPDATE`);
        this.$Modal.close(res);
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }

  ngOnDestroy() {
    this._usersSub.unsubscribe();
  }

  prepareUsers(users) {
    let user = [];
    users.forEach((u) => {
      if ((u.group_id === this.group.id || !u.group_id) && u.id !== this.owner) {
        user.push({value: u.id, label: u.fullName})
      }
    });

    return user

  }
}
