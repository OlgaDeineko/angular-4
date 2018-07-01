import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AnonymousSubscription} from 'rxjs/Subscription';

import {UsersService} from '../../../services/users.service';

import {IUser} from '../../../interfaces/i-user';
import {AuthService} from '../../../services/auth.service';
import {IGroup} from '../../../interfaces/i-group';

interface ICheckableUser extends IUser {
  disabled?: boolean;
}

@Component({
  selector: 'ma-check-users',
  templateUrl: './check-users.component.html',
  styleUrls: ['./check-users.component.scss']
})
export class CheckUsersComponent implements OnInit, OnChanges, OnDestroy {

  @Input('updateMode') updateMode: string;
  @Input('item') item: any;
  @Input('parent') parent: any;
  @Input('disabledAll') disabledAll?: boolean | null = null;


  users: ICheckableUser[] = [];
  usersArray: any[];
  selected: string[] = [];
  parentGrantedAccess: string[] = [];
  parentVisibility: string;
  groups: IGroup[];

  private _usersSub: AnonymousSubscription;
  private _groupSub: AnonymousSubscription;

  constructor(private $Users: UsersService,
              private $Auth: AuthService) {
  }

  ngOnInit() {
    this.$Users.getAll();
    this.$Users.getGroups();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selected = this.item.granted_access || [];
    this.parentVisibility = this.parent.visibility;
    // if parentGrantedAccess is empty array then all users is selected
    this.parentGrantedAccess = [];

    if (this.parentVisibility === 'private') {
      this.parentGrantedAccess = this.parent.granted_access.map(u => u);
    }

    if (this._usersSub) {
      this._usersSub.unsubscribe()
    }
    this._usersSub = this.$Users.user
      .subscribe(users => {
        this.usersArray = [];
        this._groupSub = this.$Users.groups.subscribe((groups) => {
          this.groups = groups;
          users.forEach((u) => {
            if (u.group_id) {
              u.group = this.groups.filter(g => g.id.toString() === u.group_id.toString())[0];
            }
          });
          this.users = users;
          this.usersArray = [];
          for (let i = 0; i < this.users.length; i++) {
            this.usersArray.push(this.users[i]);
          }
        });
        if (this.parentGrantedAccess.length === 0) {
          this.parentGrantedAccess = this.users.map(u => u.id);
        }

        if (!this.updateMode) {
          this.selected.splice(0);
          this.parentGrantedAccess.forEach(id => this.selected.push(id));
        }

        for (let i = 0; i < this.usersArray.length; i++) {
          if (this.usersArray[i].group_id !== null && !(this.item.groups.indexOf(this.usersArray[i].group_id) > -1)) {
            this.usersArray.splice(i, 1);
            --i;
          }
        }
        this.usersArray.forEach((user) => {
          let isAdmin = user.roleName === 'admin' || user.roleName === 'Super Admin';
          let isCurrentUser = user.email === this.$Auth.getEmail();
          let isInGroup = user.group_id !== null;
          let inParentArray = this.parentGrantedAccess.indexOf(user.id) > -1;
          let selectedIndex = this.selected.indexOf(user.id);

          user.disabled = isAdmin || !inParentArray || isCurrentUser || isInGroup;

          if (selectedIndex > -1 && !inParentArray) {
            this.selected.splice(selectedIndex, 1);
            selectedIndex = -1;
          }

          if ((isAdmin || isCurrentUser || isInGroup ) && selectedIndex === -1) {
            this.selected.push(user.id);
            selectedIndex = this.selected.indexOf(user.id);
          }
        });
      })
  }

  checkUser(userId) {
    let idx = this.selected.indexOf(userId);

    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(userId);
    }
  }


  ngOnDestroy() {
    if (this._usersSub) {
      this._groupSub.unsubscribe();
      this._usersSub.unsubscribe()
    }
  }

}
