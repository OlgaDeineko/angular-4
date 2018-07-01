import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { GeneralService } from '../../services/general.service';
import { SettingService } from '../../services/setting.service';
import { UsersService } from '../../services/users.service';
import { isUndefined } from 'util';
import { IHelpWidgetStyles } from '../../interfaces/i-help-widget-styles';

@Component({
  selector: 'ma-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit, OnDestroy {
  subdomainCode: string;
  widget_styles: IHelpWidgetStyles;
  currentsub: any;
  subplan: any;
  ownerID: string;
  db_index: string;
  user: any;
  planId = null;
  plans: any[];
  private _routeSub: AnonymousSubscription;

  constructor(private $Route: ActivatedRoute,
              private $General: GeneralService,
              private $Users: UsersService,
              private $Setting: SettingService) {
  }

  ngOnInit() {
    this._routeSub = this.$Route.paramMap
      .subscribe(res => {
        this.subdomainCode = res.get('code');
        this.$Setting.getSubdomains(this.subdomainCode).then((result) => {
          this.ownerID = result.owner_id;
          this.currentsub = result.subdomains
            .filter(subdomain => subdomain.subdomain === this.subdomainCode)[0];
          this.db_index = this.currentsub.db_index;
          this.subplan = this.currentsub.subscription_plan;
          if (typeof this.subplan !== 'undefined') {
            this.planId = this.subplan.id
          } else {
            this.planId = this.ownerID;
          }
        });
        this.$Users.getAll(this.subdomainCode);
        this.$Users.user.subscribe((users) => {
          this.user = users.filter(user => user.id === this.ownerID)[0];
        });
      });


    this.$Setting.getSubscriptions().then((res) => {
      this.plans = res;
      this.plans[0].price = '$5';
      this.plans[0].advantagestitle = '';
      this.plans[0].advantages = ['Email & social channels', 'Basic help center', 'Web Widget & Mobile SDK'];

      this.plans[1].price = '$19';
      this.plans[1].advantagestitle = 'Essential, plus...';
      this.plans[1].advantages = ['Business rules', 'Performance Dashboards', 'Public apps and integrations'];

      this.plans[2].price = '$49';
      this.plans[2].advantagestitle = 'Team, plus...';
      this.plans[2].advantages = ['Multilingual content', 'CSAT surveys', 'Custom reports & dashboards'];
    });
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
  }

  choose() {
    this.$General.redirectToSubdomain(this.subdomainCode);
  }

  setPlan(plan) {
    this.$Setting.postSubscriptions(this.db_index, plan).then((res) => {
      this.$Setting.getHelpWidgetStyles(this.currentsub.subdomain).then((result) => {
        this.widget_styles = result;
        this.widget_styles.poweredBy = res.subdomains[0].subscription_plan.rules.powered_by;
        this.$Setting.saveHelpWidgetStyles(this.widget_styles, this.currentsub.subdomain);
      });
      this.planId = plan;
      this.$Setting.getCommonSettings();
    });
  }
}
