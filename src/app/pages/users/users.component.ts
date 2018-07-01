import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnonymousSubscription } from 'rxjs/Subscription';

import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';
import { AuthService } from '../../services/auth.service';

import { CreateUserComponent } from '../../modals/create-user/create-user.component';
import { ControlAccessComponent } from '../../modals/control-access/control-access.component';

import { IUser } from '../../interfaces/i-user';
import { IMaWindow } from '../../interfaces/i-ma-window';
import { EditUserComponent } from '../../modals/edit-user/edit-user.component';
import { CreateGroupComponent } from '../../modals/create-group/create-group.component';
import { EditGroupComponent } from '../../modals/edit-group/edit-group.component';
import { IGroup } from '../../interfaces/i-group';
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';
import { ControlAccessGroupComponent } from '../../modals/control-access-group/control-access-group.component';

@Component({
  selector: 'ma-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  name = 'USERS.TITLE';
  users: IUser[];
  ownerId: string;
  disablebtnforAdmin = false;
  enablebtnforOwner = false;
  authUserID: string;
  isSuperAdmin = false;
  groups: IGroup[];
  subdomains: ISubdomainInfo[];
  orderList = [
    {
      name: 'NAME_ASC',
      attr: 'fullName'
    },
    {
      name: 'NAME_DESC',
      attr: '-fullName'
    },
    {
      name: 'ROLE_ASC',
      attr: 'roleName'
    },
    {
      name: 'ROLE_DESC',
      attr: '-roleName'
    },
    {
      name: 'EMAIL_CREATED',
      attr: 'email'
    },
    {
      name: 'EMAIL_UPDATED',
      attr: '-email'
    }
  ];
  order = {
    name: 'NAME_ASC',
    attr: 'fullName'
  };

  private _subdomainsSub: AnonymousSubscription;
  private _usersSub: AnonymousSubscription;
  private _groupSub: AnonymousSubscription;

  constructor(private $Users: UsersService,
              private $Toast: ToastService,
              private $Setting: SettingService,
              private $Auth: AuthService,
              private $modal: NgbModal) {
    this.$Users.getAll().then(() => {
      this.$Users.getGroups();
    });
  }

  ngOnInit() {
    this.authUserID = this.$Auth.getId();
    this.isSuperAdmin = 'Super Admin' === this.$Auth.getRole();
    this._subdomainsSub = this.$Setting.subdomains
      .subscribe(subdomains => {
        if (this.$Auth.getRole() !== 'Super Admin' && this.$Setting.subdomains.getValue().subdomains.length === 0) {
          this.$Setting.getSubdomains();
        }
        this.subdomains = subdomains.subdomains;
        this.ownerId = subdomains.owner_id;
        if (this.authUserID !== this.ownerId && !this.isSuperAdmin) {
          this.disablebtnforAdmin = true;
        } else {
          this.disablebtnforAdmin = false;
          this.enablebtnforOwner = true;
        }
      });

    this._usersSub = this.$Users.user.subscribe((users) => {
      (window as IMaWindow).Appcues.start();
      this._groupSub = this.$Users.groups.subscribe((groups) => {
        groups.forEach((g) => {
          g.subdomains = this.prepareGroupSubdomains(g);
        });
        this.groups = groups;
        users.forEach((u) => {
          if (u.group_id) {
            u.group = this.groups.filter(g => g.id.toString() === u.group_id.toString())[0];
          }
        });
        this.users = users;
      });

    });

  }


  createUser() {
    let createUserModal = this.$modal.open(CreateUserComponent);
    createUserModal.componentInstance.user = this.$Users.getNewUser();
  };

  createGroup() {
    let createGroupModal = this.$modal.open(CreateGroupComponent);
    createGroupModal.componentInstance.group = this.$Users.getNewGroup();
    createGroupModal.componentInstance.owner = this.ownerId;
  }

  remove(id: number) {
    this.$Users.remove(id)
      .then(() => {
        this.$Toast.success('MESSAGES.USER_REMOVED');
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }

  edit(user: IUser) {
    let editUserModal = this.$modal.open(EditUserComponent);
    editUserModal.componentInstance.user = user;
    editUserModal.componentInstance.ownerId = this.ownerId;
  }

  changeStatus(user: IUser, status: number) {
    if (status === 1) {
      this.$Users.enable(user)
        .then(() => {
          this.$Toast.success('MESSAGES.USER_STATUS_CHANGED');
        })
        .catch((error) => {
          this.$Toast.showServerErrors(error);
        });
    } else {
      this.$Users.disable(user)
        .then(() => {
          this.$Toast.success('MESSAGES.USER_STATUS_CHANGED');
        })
        .catch((error) => {
          this.$Toast.showServerErrors(error);
        });
    }
  }

  changeOrder(item: any) {
    this.order = item;
  }

  control_access(user: IUser) {
    let controlAccessModal = this.$modal.open(ControlAccessComponent, {size: 'lg'});
    controlAccessModal.componentInstance.user = user;
  }

  control_access_group(group: IGroup) {
      let controlAccessModal = this.$modal.open(ControlAccessGroupComponent, {size: 'lg'});
      controlAccessModal.componentInstance.group = group;
  }

  changeOwner(userId: string) {
    this.$Setting.changeOwner(this.ownerId, userId)
      .then(() => {
        this.ownerId = userId;
        if (!this.isSuperAdmin) {
          this.disablebtnforAdmin = true;
          this.enablebtnforOwner = false;
        } else {
          this.disablebtnforAdmin = false;
          this.enablebtnforOwner = true;
        }
        this.$Users.getAll();
        this.$Toast.success('MESSAGES.ACCOUNT_OWNER_CHANGED');
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      });
  }

  editGroup(group) {
    let editGrooupModal = this.$modal.open(EditGroupComponent);
    editGrooupModal.componentInstance.group = group;
    editGrooupModal.componentInstance.owner = this.ownerId;
  }

  removeGroup(id) {
    this.$Users.removeGroup(id)
      .then(() => {
        this.$Toast.success('MESSAGES.GROUP_REMOVED');
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      })
  }

  ngOnDestroy() {
    this._usersSub.unsubscribe();
    this._groupSub.unsubscribe();
    this._subdomainsSub.unsubscribe();
  }

  prepareGroupSubdomains(group) {
    let shared_subdomains = [];
    this.subdomains.forEach((s) => {
      if (group.shared_subdomains_indexes.indexOf(s.db_index) > -1) {
        shared_subdomains.push(s);
      }
    });
    return shared_subdomains
  }

}
