import { Component, OnDestroy, OnInit } from '@angular/core';
import {SettingService} from '../../services/setting.service';
import {ISubdomains} from '../../interfaces/i-subdomains';
import { Router } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';

@Component({
  selector: 'ma-choose-subdomain-for-superadmin',
  templateUrl: './choose-subdomain-for-superadmin.component.html',
  styleUrls: ['./choose-subdomain-for-superadmin.component.scss']
})
export class ChooseSubdomainForSuperadminComponent implements OnInit, OnDestroy {
  subdomains: ISubdomains;
  choosesubdomainpath = false;

  private _routeSub: AnonymousSubscription;

  constructor(private $Setting: SettingService, private $Router: Router) { }

  ngOnInit() {
    this.$Setting.getAllSubdomains()
      .then((res) => {
        this.subdomains = res.subdomains;
      })
    if (this.$Router.url === '/admin/choosesubdomain') {
      this.choosesubdomainpath = true;
    }
    this._routeSub = this.$Router.events.subscribe(() => {
      this.choosesubdomainpath = this.$Router.url === '/admin/choosesubdomain';
    })
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
  }
}
