import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SettingService } from '../../../../services/setting.service';
import { ToastService } from '../../../../services/toast.service';
import { SessionService } from '../../../../services/session.service';

import { IS_LOCAL, MAIN_DOMAIN } from '../../../../../environments/environment';

@Component({
  selector: 'ma-choose-subdomain',
  templateUrl: './choose-subdomain.component.html',
  styleUrls: ['./choose-subdomain.component.scss']
})
export class ChooseSubdomainComponent implements OnInit {
  subdomainForm: FormGroup;

  constructor(private $Setting: SettingService,
              private $Session: SessionService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this.subdomainForm = new FormGroup({
      subdomain: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ])
    });
  }

  submit() {
    let subdomain = this.subdomainForm.get('subdomain').value;

    this.$Setting.checkSubdomain(subdomain)
      .then(res => {
        this.$Session.subdomain.data = subdomain;
        window.location.href = `${IS_LOCAL ? 'http' : 'https'}://${subdomain}.${MAIN_DOMAIN}/login`;
      })
      .catch(err => {
        this.$Toast.error('MESSAGES.KB_DONT_EXIST');
      })
  }

}
