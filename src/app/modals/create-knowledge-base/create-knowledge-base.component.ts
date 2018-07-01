import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';
import { SessionService } from '../../services/session.service';
import { TreeService } from '../../services/tree.service';
import { AuthService } from '../../services/auth.service';
import { AnonymousSubscription } from 'rxjs/Subscription';


@Component({
  selector: 'ma-create-knowledge-base',
  templateUrl: './create-knowledge-base.component.html',
  styleUrls: ['./create-knowledge-base.component.scss']
})
export class CreateKnowledgeBaseComponent implements OnInit, OnDestroy {
  createKBForm: FormGroup;
  name = 'DASHBOARD.CREATE_KB';
  parentSubdomain: string;
  private _parentSabdomainSub: AnonymousSubscription;

  constructor(private $Toast: ToastService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $Auth: AuthService,
              private $Tree: TreeService,
              public $Modal: NgbActiveModal) {
  }

  ngOnInit() {
    this._parentSabdomainSub = this.$Setting.purentSubdomain.subscribe(sub => {
      this.parentSubdomain = sub;
    });

    this.createKBForm = new FormGroup({
      accessibility: new FormControl('public'),
      subdomain: new FormControl('', [
        Validators.minLength(4),
        Validators.required
      ]),
      custom_domain: new FormControl(''),
    });
  }

  submit() {
    let kbData: any = this.createKBForm.getRawValue();
    this.$Setting.saveKnowledgeBase(kbData, this.parentSubdomain)
      .then((result) => {
        this.$Toast.success('MESSAGES.KB_CREATE');
        this.$Session.subdomain.data = kbData.subdomain;
        this.$Setting.getKBSettings();
        this.$Setting.getSubdomains(this.parentSubdomain);
        this.$Auth.updateCurrentUser();
        this.$Tree.rebuildTree();
        this.$Modal.close();
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      });
  }

  ngOnDestroy() {
    this._parentSabdomainSub.unsubscribe();
  }
}
