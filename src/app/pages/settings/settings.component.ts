import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';


@Component({
  selector: 'ma-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingspath = false;
  private _routeSub: AnonymousSubscription;

  constructor(private $Router: Router) {
  }

  ngOnInit() {
    if (this.$Router.url === '/admin/settings') {
      this.settingspath = true;
    }
    this._routeSub = this.$Router.events.subscribe(() => {
      this.settingspath = this.$Router.url === '/admin/settings';
    })
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
  }
}
