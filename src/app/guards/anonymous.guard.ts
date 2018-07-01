import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// services
import { AuthService } from '../services/auth.service';

// it's guard not used anywhere (please remove this comment if will use)
@Injectable()
export class AnonymousGuard implements CanActivate {

  constructor(private $Auth: AuthService,
              private $Router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    if (this.$Auth.isLogin()) {
      this.$Router.navigateByUrl('/');
      return false
    }
    return true;
  }
}
