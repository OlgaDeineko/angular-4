import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SettingService } from '../../services/setting.service';
import { GeneralService } from "../../services/general.service";

import { ISubdomains } from '../../interfaces/i-subdomains';

@Component({
  selector: 'ma-choose-subdomain-modal',
  templateUrl: './choose-subdomain-modal.component.html',
  styleUrls: ['./choose-subdomain-modal.component.scss']
})
export class ChooseSubdomainModalComponent implements OnInit {

  subdomains: ISubdomains;

  constructor(public $Modal: NgbActiveModal,
              private $Setting: SettingService,
              private $General: GeneralService) {
  }

  ngOnInit() {
    this.$Setting.getAllSubdomains()
      .then((res) => {
        this.subdomains = res.subdomains;
      })
  }

  choose(subdomain) {
    this.$General.redirectToSubdomain(subdomain);
  }
}
