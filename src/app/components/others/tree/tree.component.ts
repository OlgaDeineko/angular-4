import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';

import {SettingService} from '../../../services/setting.service';
import {TreeService} from '../../../services/tree.service';
import {GeneralService} from '../../../services/general.service';
import {FaqService} from '../../../services/faq.service';

import {IOrderList} from '../../../interfaces/i-order-list';
import {ICategory} from '../../../interfaces/i-category';
import {IFaq} from '../../../interfaces/i-faq';
import {CategoryService} from '../../../services/category.service';
import {ILang} from '../../../interfaces/i-lang';
import {TreeUntranslateService} from '../../../services/tree-untranslate.service';
import {SessionService} from '../../../services/session.service';

@Component({
  selector: 'ma-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, OnDestroy {

  order: IOrderList;
  orderList: IOrderList[];
  tree: ICategory;
  searchModel = '';

  faqResults: IFaq[];
  categoryResults: ICategory[];
  languages: ILang[];
  transLang: ILang[];
  defaultSystemLang: string;

  private _languagesSettingsSub: AnonymousSubscription;


  private _treeSub: AnonymousSubscription;
  private _filterSub: AnonymousSubscription;
  private _faqsSub: AnonymousSubscription;

  @Input('translates') translates?: boolean = false;

  constructor(private $Setting: SettingService,
              private $Tree: TreeService,
              private $TreeUntranslate: TreeUntranslateService,
              private $Faq: FaqService,
              private $Category: CategoryService,
              private $General: GeneralService,
              private $Session: SessionService,
              private $Route: ActivatedRoute) {
    this.orderList = this.$General.orderList;
  }

  ngOnInit() {
    this.defaultSystemLang = this.$Session.systemLang.data.code;
    this.searchModel = '';
    this._filterSub = this.$Setting.filter
      .subscribe(res => {
        this.order = this.$General.orderList.find((o) => o.name === res.sort_by);
      });


    if (this.translates === true) {
      this._treeSub = this.$TreeUntranslate.tree
        .subscribe((res) => {
          if (res === null) {
            return;
          }
          this.tree = res;
          this.searchModel = '';
        });

      this.$Route.paramMap
        .subscribe((res) => {
          this.$TreeUntranslate.getTree(res.get('subcategorySlug') || res.get('categorySlug') || this.$General.homeSlug);
        });
    } else {
      this._treeSub = this.$Tree.tree
        .subscribe((res) => {
          if (res === null) {
            return;
          }
          this.tree = res;
          this.searchModel = '';
        });

      this.$Route.paramMap
        .subscribe((res) => {
          this.$Tree.getTree(res.get('subcategorySlug') || res.get('categorySlug') || this.$General.homeSlug);
        });
    }


    this._faqsSub = this.$Faq.filteredFaqs
      .subscribe(res => {
        this.faqResults = res;
      });

    this._languagesSettingsSub = this.$Setting.getallowlanguages
      .subscribe((languages: ILang[]) => {
        if (languages.length > 0) {
          this.languages = languages;
          if (this.translates) {
            this.transLang = languages;
          } else {
            if (this.defaultSystemLang === 'nl') {
              this.transLang = languages.filter((lang) => lang.code !== 'nl');
            } else {
              this.transLang = languages.filter((lang) => lang.code !== 'en');
            }

          }
        } else {
          if (this.defaultSystemLang === 'nl') {
            this.languages = [{name: 'Dutch', code: 'nl'}];
          } else {
            this.languages = [{name: 'English', code: 'en'}];
          }

        }
      });
  }

  ngOnDestroy() {
    this._treeSub.unsubscribe();
    this._filterSub.unsubscribe();
    this._faqsSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
  }

  changeOrder(item) {
    this.order = item;
    this.$Setting.changeCategoryOrder(item.name);
  }

  search() {
    this.$Faq.filterFaq(this.searchModel.trim(), '!trash', this.tree.type === 'category' ? this.tree.id : null);
    if (this.translates === true) {
      if (this.$TreeUntranslate.treeCategories) {
        this.categoryResults = this.$TreeUntranslate.treeCategories
          .filter(c => {
            if (this.tree.type === 'category') {
              return this.tree.id === c.parent_id;
            } else {
              return true;
            }
          })
          .filter(c => c.name.search(this.searchModel.trim()) !== -1)
      }
    } else {
      if (this.$Tree.treeCategories) {
        this.categoryResults = this.$Tree.treeCategories
          .filter(c => {
            if (this.tree.type === 'category') {
              return this.tree.id === c.parent_id;
            } else {
              return true;
            }
          })
          .filter(c => c.name.search(this.searchModel.trim()) !== -1)
      }
    }
  }

  movedCategory(ev) {
    let order: { id: number, order: number }[] = [];
    let idx = 0;

    this.tree.categories.forEach(item => {
      if (item.sort_order !== idx) {
        order.push({id: item.id, order: idx})
      }
      idx++;
    });

    this.$Category.changeOrder(order).then(() => {
      this.$Tree.rebuildTree();
    });
  }

  movedFaq(ev) {
    let order: { id: number, order: number }[] = [];
    let idx = 0;

    this.tree.faqs.forEach(item => {
      if (item.sort_order !== idx) {
        order.push({id: +item.id, order: idx})
      }
      idx++;
    });

    this.$Faq.changeOrder(order).then(() => {
      this.$Tree.rebuildTree();
    });
  }
}
