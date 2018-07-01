import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {Title} from '@angular/platform-browser';

import { LoginComponent } from '../../pages/login/login.component';

import { SettingService } from '../../services/setting.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { TreeService } from '../../services/tree.service';
import { UrlService } from '../../services/url.service';
import { SessionService } from '../../services/session.service';
import { TreeTranslateService } from '../../services/tree-translate.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'ma-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent extends LoginComponent {
  // TODO: wtf? Is this my advice? i am stupid((( need rewrite?
  constructor($Auth: AuthService,
              $Toast: ToastService,
              $Setting: SettingService,
              $Router: Router,
              $Title: Title,
              $Session: SessionService,
              $Url: UrlService,
              $Tree: TreeService,
              $TreeTranslate: TreeTranslateService,
              $modal: NgbModal,
              $Translate: TranslateService,
              public $ActiveModal: NgbActiveModal) {
    super($Auth, $Toast, $Setting, $Router, $Title, $Session, $Url, $Tree, $TreeTranslate, $Translate, $modal);
  }
}
