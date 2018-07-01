import { Component, OnDestroy } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ma-activation-user',
  templateUrl: './activation-user.component.html',
  styleUrls: ['./activation-user.component.scss']
})
export class ActivationUserComponent implements OnDestroy {

  private _routeParamsSub: AnonymousSubscription;

  constructor(private $Toast: ToastService,
              private $Auth: AuthService,
              private $Router: Router,
              private $Session: SessionService,
              private $Route: ActivatedRoute) {
    $Auth.logOut(false);

    this._routeParamsSub = this.$Route.queryParamMap
      .subscribe(res => {
        let activationToken = res.get('token');
        let tag = res.get('t');
        let secret = res.get('s');
        if (activationToken && tag && secret) {
          this.$Auth.sendActivation(activationToken, tag, secret)
            .then(result => {
              this.$Toast.success('MESSAGES.ACCOUNT_ACTIVATED');
              this.$Session.token.data = result.access_token;
              this.$Auth.getCurrentUser()
                .then(() => {
                    this.$Router.navigateByUrl('/admin');
                  }
                )
                .catch(err => {
                  this.$Toast.showServerErrors(err);
                  this.$Router.navigateByUrl('/login');
                });
            })
            .catch(err => {
              this.$Toast.showServerErrors(err);
              this.$Router.navigateByUrl('/login');
            })
        } else {
          this.$Router.navigateByUrl('/');
        }
      });
  }

  ngOnDestroy() {
    this._routeParamsSub.unsubscribe();
  }
}
