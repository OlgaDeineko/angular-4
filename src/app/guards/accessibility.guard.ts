import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// enums
import { ResponseStatuses } from '../enums/response-statuses.enum';

// services
import { ToastService } from '../services/toast.service';
import { SettingService } from '../services/setting.service';
import { AuthService } from '../services/auth.service';
import { HttpHandlerService } from '../services/http-handler.service';

@Injectable()
export class AccessibilityGuard implements CanActivate {
  constructor(private $Router: Router,
              private $Toast: ToastService,
              private $Auth: AuthService,
              private $HttpHandler: HttpHandlerService,
              private $Setting: SettingService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable(observer => {
      this.$HttpHandler.httpError$
        .map(err => err.realStatus)
        .filter(s => s === ResponseStatuses.forbidden || s === ResponseStatuses.unauthorized)
        .first()
        .subscribe(err => observer.next(false));

      this.$Setting.accessibility
        .filter(accessibility => accessibility !== null)
        .subscribe(accessibility => {
          if (accessibility[0].status === 'private' && !this.$Auth.isLogin()) {
            this.$Toast.error('MESSAGES.KB_PRIVATE_LOGIN', 'MESSAGES.AUTHORIZATION_ERROR');
            this.$Router.navigate(['/login']);
            observer.next(false);
          } else {
            observer.next(true);
          }
        })
    })
  }
}
