import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ma-registration-app',
  templateUrl: './registration-app.component.html',
  styleUrls: ['./registration-app.component.scss']
})
export class RegistrationAppComponent {

  constructor($Translate: TranslateService) {
    $Translate.setDefaultLang('nl');
    $Translate.use('nl');
  }

}
