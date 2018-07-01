import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class RoleAccessesGuard implements CanActivate {

  constructor(private $Auth: AuthService,
              private $Router: Router,
              private $Toast: ToastService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {
    let permissions = next.data.permissions;

    if (!permissions || !permissions.roles || !Array.isArray(permissions.roles)) {
      return true;
    }

    return new Observable(observer => {
      this.$Auth.getCurrentUser()
        .then(() => {
          observer.next(this._checkRole(permissions, this.$Auth.getRole()));
        })
    })
  }

  private _checkRole(permissions: { roles: string, redirectTo?: string }, role: string): boolean {
    let allowed: boolean;
    if (role === 'Super Admin') {
      allowed = true;
    } else {
      allowed = permissions.roles.indexOf(role) !== -1;
    }

    if (allowed) {
      return true
    } else {
      this.$Toast.error('MESSAGES.NOT_ACCESS');
      this.$Router.navigateByUrl(permissions.redirectTo || '/login');
      return false;
    }
  }
}
