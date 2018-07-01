import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SessionService } from '../../services/session.service';
import { IS_LOCAL, MAIN_DOMAIN } from '../../../environments/environment';

@Component({
  selector: 'ma-login-app',
  templateUrl: './login-app.component.html',
  styleUrls: ['./login-app.component.scss']
})
export class LoginAppComponent {

  constructor(private $Translate: TranslateService,
              private $Session: SessionService) {
    $Translate.setDefaultLang('nl');
    $Translate.use('nl');
    if ($Session.subdomain.data) {
      window.location.href = `${IS_LOCAL ? 'http' : 'https'}://${$Session.subdomain.data}.${MAIN_DOMAIN}/login`;
    }
  }
}
