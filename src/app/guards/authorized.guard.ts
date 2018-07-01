import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';


@Injectable()
export class AuthorizedGuard implements CanActivate {

  constructor(private $Auth: AuthService,
              private $Router: Router,
              private $Toast: ToastService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    if (this.$Auth.isLogin()) {
      return true;
    } else {
      this.$Toast.error('MESSAGES.NOT_LOGIN', `MESSAGES.AUTHORIZATION_ERROR`);
      this.$Router.navigateByUrl('/login');
      return false;
    }
  }
}
