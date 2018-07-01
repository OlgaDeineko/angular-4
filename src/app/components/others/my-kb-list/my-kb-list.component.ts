import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { SettingService } from '../../../services/setting.service';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { ISubdomainsInfoResponce } from '../../../interfaces/i-subdomains-info-responce';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ISubdomainInfo } from '../../../interfaces/i-subdomain-info';

@Component({
  selector: 'ma-my-kb-list',
  templateUrl: './my-kb-list.component.html',
  styleUrls: ['./my-kb-list.component.scss']
})
export class MyKbListComponent implements OnInit, OnDestroy {

  @Output('onChangeKB') onChangeKB: EventEmitter<ISubdomainInfo> = new EventEmitter<ISubdomainInfo>();
  @Input('withButton') withButton: boolean = false;

  currentSubdomain: string;
  subdomains: ISubdomainInfo[];
  allSubdomains: BehaviorSubject<ISubdomainsInfoResponce>;

  private _userSub: AnonymousSubscription;

  constructor(public $Auth: AuthService,
              private $Session: SessionService,
              private $Setting: SettingService) {
    this.allSubdomains = this.$Setting.subdomains;
  }

  ngOnInit() {
    this.currentSubdomain = this.$Session.subdomain.data;
    this.subdomains = this.$Auth.getSubdomains();
    this._userSub = this.$Auth.userIsChanged
      .subscribe(() => {
        this.subdomains = this.$Auth.getSubdomains();
      });

    if (this.$Auth.getRole() === 'Super Admin' && this.$Setting.subdomains.getValue().subdomains.length === 0) {
      this.$Setting.getSubdomains();
    }
  }

  onClick(subdomain: ISubdomainInfo) {
    this.currentSubdomain = subdomain.subdomain;
    this.onChangeKB.emit(subdomain);
  }

  ngOnDestroy() {
    this._userSub.unsubscribe();
  }

}
