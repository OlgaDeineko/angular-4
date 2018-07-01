import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SessionService } from '../services/session.service';

@Injectable()
export class NotExistSubdomainGuard implements CanActivate {
  constructor(private $Session: SessionService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return !this.$Session.subdomain.data;
  }
}
