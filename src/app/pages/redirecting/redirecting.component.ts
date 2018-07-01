import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { FaqService } from '../../services/faq.service';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'ma-redirecting',
  templateUrl: './redirecting.component.html',
  styleUrls: ['./redirecting.component.scss']
})
export class RedirectingComponent implements OnDestroy {

  private _routeParamsSub: AnonymousSubscription;

  constructor(private $Auth: AuthService,
              private $Session: SessionService,
              private $Router: Router,
              private $Faq: FaqService,
              private $Url: UrlService,
              private $Route: ActivatedRoute) {
    this._routeParamsSub = this.$Route.queryParamMap
      .subscribe(res => {
        let jvcToken = res.get('t');
        let livechatic = res.get('faq');

        if (jvcToken) {
          this.$Session.token.data = jvcToken;
          this.$Session.subdomain.data = this.$Url.subdomain;
          this.$Auth.getCurrentUser()
            .then(() => this.$Router.navigateByUrl('/admin'))
        } else if (livechatic) {
          this.$Faq.getByAlgoliaId(Number(livechatic))
            .then(result => this.$Router.navigate(this.$Faq.getLink(result, 'visitor')))
            .catch(err => {
              if (err.status === 404) {
                this.$Router.navigateByUrl('/404');
              } else {
                this.$Router.navigateByUrl('/');
              }
            })
        } else {
          this.$Router.navigateByUrl('/');
        }

      })
  }

  ngOnDestroy() {
    this._routeParamsSub.unsubscribe();
  }

}
