import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { IAppearance } from '../../interfaces/i-appearance';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';
import { ISubdomainInfo } from '../../interfaces/i-subdomain-info';
import { TreeService } from '../../services/tree.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ma-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit, OnDestroy {
  advancedForm: FormGroup;
  appearanceSub: AnonymousSubscription;
  currentSubdomain: string;

  constructor(private $Setting: SettingService,
              private $Session: SessionService,
              private $Tree: TreeService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    this.advancedForm = new FormGroup({
      kbName: new FormControl(''),
      kbSubtitle: new FormControl(''),
      headColor: new FormControl(''),
      linkColor: new FormControl(''),
      footerColor: new FormControl(''),
      kbTitleColor: new FormControl(''),
      buttonColor: new FormControl(''),
      menuBarColor: new FormControl(''),
      buttonTextColor: new FormControl(''),
      footerTitleColor: new FormControl(''),
      bodyFont: new FormControl('Times New Roman'),
      titleFont: new FormControl('Times New Roman'),
      footerFont: new FormControl('Times New Roman'),
      logoURL: new FormControl(''),
      footerTitle: new FormControl(''),
      contactURL: new FormControl(''),
      searchText: new FormControl(''),
      headerCode: new FormControl(''),
      bodyCode: new FormControl(''),
      liveChatScript: new FormControl(''),
      liveChatUrl: new FormControl(''),
      categoryTree: new FormControl('true')
    });

    this.appearanceSub = this.$Setting.appearance
      .subscribe((appearance: IAppearance) => {
        if (appearance) {
          if (!appearance.styles || Array.isArray(appearance.styles)) {
            appearance.styles = {}
          }
          if (!appearance.styles.headerCode) {
            this.advancedForm.patchValue({headerCode: ''});
          }
          if (!appearance.styles.bodyCode) {
            this.advancedForm.patchValue({bodyCode: ''});
          }
          this.advancedForm.patchValue(appearance.styles);
        }
      })
  }

  submit() {
    let advanceData = this.advancedForm.getRawValue();
    advanceData.labels = this.$Setting.appearance.getValue().labels;
    this.$Setting.saveAppearanceeStyle(advanceData)
      .then(() => {
        this.$Toast.success('MESSAGES.ADVANCED_SAVED');
        setTimeout(() => {
          location.reload();
        }, 2000);
      });
  }

  switchKB(subdomain: ISubdomainInfo) {
    this.$Session.subdomain.data = subdomain.subdomain;
    this.currentSubdomain = this.$Session.subdomain.data;
    this.$Setting.getKBSettings();
    this.$Tree.rebuildTree();
  }

  ngOnDestroy() {
    this.appearanceSub.unsubscribe();
  }
}
