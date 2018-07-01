import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SettingService } from './setting.service';

@Injectable()
export class AdminResolverService implements Resolve<any> {

  constructor(private $Setting: SettingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.$Setting.getHelpWidgetStyles();
    this.$Setting.getCommonSettings();
    return new Promise(resolve => {
      this.$Setting.commonSettings
        .subscribe(settings => {
          if (settings) {
            resolve(settings)
          }
        });
    });
  }
}

