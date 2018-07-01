import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

// services
import { CategoryService } from '../../../services/category.service';
import { GeneralService } from '../../../services/general.service';

// interfaces
import { IBreadcrumb } from '../../../interfaces/i-breadcrumb';
import { ICategory } from '../../../interfaces/i-category';
import {ILang} from '../../../interfaces/i-lang';
import {SettingService} from '../../../services/setting.service';
import {SessionService} from '../../../services/session.service';

@Component({
  selector: 'ma-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: IBreadcrumb[] = [];
  visitorLang: ILang;
  defaultSystemLang: string;

  private _categoriesSub: AnonymousSubscription;
  private _routeSub: AnonymousSubscription;
  private _visitorLangSub: AnonymousSubscription;

  @Input('translates') translates?: boolean = false;
  @Input('untranslated') untranslated?: boolean = false;

  constructor(private $Category: CategoryService,
              private $General: GeneralService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $Route: ActivatedRoute) {
  }

  private _buildBreadcrumb(categories: ICategory[]) {
    this._routeSub = this.$Route.paramMap
      .subscribe(params => {
        this.breadcrumbs = [];
        let slug = this.$General.getCurrentSlugByParams(params);
        while (slug) {
          let category = categories.find(c => c.slug === slug);

          if (!category) {
            return;
          }
          this.breadcrumbs.unshift({
            name: category.name,
            lang: category.lang,
            parent_slug: category.parent_slug,
            slug: category.slug,
            type: category.type,
          });
          slug = category.parent_slug;
        }
      })
  }

  ngOnInit() {
    this._visitorLangSub = this.$Setting.visitorLanguage
      .subscribe((languag: ILang) => {
      this.visitorLang = languag;
      });
    this.defaultSystemLang = this.$Session.systemLang.data.code;

    if (this.untranslated) {
      this._categoriesSub = this.$Category.categoriesUntranslated
        .filter(res => res !== null)
        .subscribe(res => this._buildBreadcrumb(res));

      if (this.$Category.categoriesUntranslated.getValue() === null) {
        this.$Category.getUntranslatedCategories();
      }
    }else if (this.translates) {
      this._categoriesSub = this.$Category.categoriesTranslate
        .filter(res => res !== null)
        .subscribe(res => this._buildBreadcrumb(res));

      if (this.$Category.categoriesTranslate.getValue() === null) {
        this.$Category.getCategoriesForLang(this.visitorLang.code);
      }
    }else {
      this._categoriesSub = this.$Category.categories
        .filter(res => res !== null)
        .subscribe(res => this._buildBreadcrumb(res));

      if (this.$Category.categories.getValue() === null) {
        this.$Category.getAll(this.defaultSystemLang);
      }
    }

  }

  generateLink(item) {
    if (this.untranslated === true) {
      return this.$Category.getLink(item, 'translates');
    } else {
      return this.$Category.getLink(item, this.$General.isAdminPanel ? 'admin' : 'kb');
    }
  }

  ngOnDestroy() {
    this._categoriesSub.unsubscribe();
    this._visitorLangSub.unsubscribe();
    if (this._routeSub) {
      this._routeSub.unsubscribe();
    }
  }
}
