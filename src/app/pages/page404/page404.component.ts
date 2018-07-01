import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';

// interfaces
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';

// services
import { SettingService } from '../../services/setting.service';
import { UrlService } from '../../services/url.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ma-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit, OnDestroy {
  checkKb: boolean = false;
  currentsubdomain: string;
  powered_by = true;
  plan: any;
  currentsubdomainData: ISubdomainInfo[];

  private _subdomainsSub: AnonymousSubscription;

  constructor(private $Setting: SettingService,
              private $Url: UrlService,
              private $Session: SessionService,
              public $Auth: AuthService) {
    if (this.$Auth.isLogin()) {
      this.$Auth.getCurrentUser();
      this.$Setting.getSubdomains();
    }

    if (this.$Url.isMyanswersDomain) {
      this.$Setting.checkSubdomain(this.$Url.subdomain)
        .then(() => this.checkKb = true)
    }
  }

  ngOnInit() {
    this.currentsubdomain = this.$Session.subdomain.data;
    if (this.$Auth.isLogin()) {
      this._subdomainsSub = this.$Setting.subdomains
        .subscribe(subdomains => {
          this.currentsubdomainData = subdomains.subdomains.filter(subdomain => subdomain.subdomain === this.currentsubdomain);
          if (this.currentsubdomainData.length > 0) {
            this.plan = this.currentsubdomainData[0].subscription_plan;
            this.powered_by = this.plan.rules.powered_by;
          }
        });
    }
  }

  ngOnDestroy() {
    if (this._subdomainsSub) {
      this._subdomainsSub.unsubscribe();
    }
  }
}
