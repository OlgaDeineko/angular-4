import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CategoryService } from '../../services/category.service';
import { GeneralService } from '../../services/general.service';
import { ToastService } from '../../services/toast.service';

import { ICategory } from '../../interfaces/i-category';
import { CreateCategoryComponent } from '../../modals/create-category/create-category.component';
import { CreateKnowledgeBaseComponent } from '../../modals/create-knowledge-base/create-knowledge-base.component';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { SettingService } from '../../services/setting.service';
import { ISubdomainsInfoResponce } from '../../interfaces/i-subdomains-info-responce';
import { IMaWindow } from '../../interfaces/i-ma-window';

@Component({
  selector: 'ma-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  currentCategory: ICategory;
  isAcOwner = false;
  isSuperAdmin = false;
  private _ownerSub: AnonymousSubscription;

  constructor(private $Category: CategoryService,
              private $General: GeneralService,
              private $Toast: ToastService,
              private $Session: SessionService,
              public $Setting: SettingService,
              private $Modal: NgbModal,
              private $Auth: AuthService,
              private $Router: Router,
              private $Route: ActivatedRoute) {
    this.$Route.paramMap
      .subscribe(params => {
        this.$General.setPageTitle();
        (window as IMaWindow).Appcues.start();
        this.$Category
          .getBySlug(this.$General.getCurrentSlugByParams(params))
          .subscribe(
            res => {
              this.currentCategory = res;
              this.$Session.kbRout.data = this.$Category.getLink(res, 'visitor');
            },
            error => {
              if (error.error.status === 404) {
                this.$Toast.error('CATEGORY.NOT_FOUND');
                this.$Router.navigate(['/404']);
              } else {
                this.$Toast.showServerErrors(error);
                this.$Router.navigate(['/admin']);
              }
            })
      });
  }

  ngOnInit() {
    this._ownerSub = this.$Setting.subdomains
      .map((res: ISubdomainsInfoResponce) => res.owner_id)
      .subscribe(ownerId => {
        this.isAcOwner = ownerId === this.$Auth.getId();
        this.isSuperAdmin = 'Super Admin' === this.$Auth.getRole();
      });
  }

  ngOnDestroy() {
    this._ownerSub.unsubscribe();
  }

  createCategory() {
    let createCategoryModal = this.$Modal.open(CreateCategoryComponent);
    createCategoryModal.componentInstance.parentCategory = this.currentCategory;
  }

  createKB() {
    this.$Modal.open(CreateKnowledgeBaseComponent, {size: 'lg'});
  };
}
