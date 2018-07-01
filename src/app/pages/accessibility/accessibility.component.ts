import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnonymousSubscription } from 'rxjs/Subscription';

import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';
import { SessionService } from '../../services/session.service';
import { TreeService } from '../../services/tree.service';
import { GeneralService } from '../../services/general.service';
import { AuthService } from '../../services/auth.service';

import { IKbAccessibility } from '../../interfaces/i-kb-accessibility';
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';
import { IS_LOCAL, MAIN_DOMAIN } from '../../../environments/environment';


@Component({
  selector: 'ma-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccessibilityComponent implements OnInit, OnDestroy {
  accessibilityForm: FormGroup;

  currentSubdomain: string;
  oldCustom = '';
  goToKB: string;
  accessibilitySub: AnonymousSubscription;
  customSubdomainSub: AnonymousSubscription;
  subdomainSub: AnonymousSubscription;

  constructor(private $Toast: ToastService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $Tree: TreeService,
              public $Auth: AuthService,
              private $General: GeneralService) {
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;

    this.accessibilityForm = new FormGroup({
      status: new FormControl('private'),
      subdomain: new FormControl('', [
        Validators.required
      ]),
      custom_domain: new FormControl('')
    });

    this.accessibilitySub = this.$Setting.accessibility
      .subscribe((accessibility: IKbAccessibility[]) => {
        if (accessibility === null) {
          return;
        }
        this.accessibilityForm.patchValue({status: accessibility[0].status})
      });

    this.subdomainSub = this.$Setting.subdomain
      .subscribe((subdomain) => {
        this.goToKB = `${IS_LOCAL ? 'http' : 'https'}://${subdomain}.${MAIN_DOMAIN}`;
        this.accessibilityForm.patchValue({subdomain: subdomain})
      });

    this.customSubdomainSub = this.$Setting.custom_subdomain
      .subscribe((custom_subdomain: string | boolean) => {
        if (custom_subdomain !== false) {
          this.oldCustom = <string> custom_subdomain;
          this.accessibilityForm.patchValue({custom_domain: custom_subdomain})
        }
      });
  }

  submit() {
    let accessibilityData: IKbAccessibility = this.accessibilityForm.getRawValue();
    this.$Setting.saveAccessibility(accessibilityData)
      .then(() => {
        this.$Tree.rebuildTree();
        this.$Toast.success('MESSAGES.ACCESSIBILITY_SAVED');

        if (this.currentSubdomain !== accessibilityData.subdomain) {
          this.$Setting.saveSubdomainName(accessibilityData.subdomain)
            .then(() => {
              this.$General.redirectToSubdomain(accessibilityData.subdomain);
            })
            .catch(error => {
              this.$Toast.showServerErrors(error);
            });
        }

        if (this.oldCustom !== accessibilityData.custom_domain) {
          this.$Setting.saveCustomDomain(accessibilityData.custom_domain)
            .catch(error => {
              this.$Toast.showServerErrors(error);
            });
        }
      })
  }

  switchKB(subdomain: ISubdomainInfo) {
    this.$Session.subdomain.data = subdomain.subdomain;
    this.currentSubdomain = this.$Session.subdomain.data;
    this.$Setting.getKBSettings();
    this.$Tree.rebuildTree();
  }

  ngOnDestroy() {
    this.accessibilitySub.unsubscribe();
    this.customSubdomainSub.unsubscribe();
    this.subdomainSub.unsubscribe();
  }
}
