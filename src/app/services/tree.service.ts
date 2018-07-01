import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {CategoryService} from './category.service';
import {FaqService} from './faq.service';
import {GeneralService} from './general.service';

import {ICategory} from '../interfaces/i-category';
import {IFaq} from '../interfaces/i-faq';
import {SessionService} from './session.service';

@Injectable()
export class TreeService {
  private _tree: BehaviorSubject<ICategory>;
  private _treeCategories: ICategory[] = null;
  public _slug: string = null;

  constructor(public $Category: CategoryService,
              public $Faq: FaqService,
              private $Session: SessionService,
              public $General: GeneralService) {
    this.init()
  }


  init() {
    this._tree = new BehaviorSubject(null);

    this.$Category.categories
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        if (this.$Faq.faqs.getValue() !== null) {
          this.buildTree();
        }
      });

    this.$Faq.faqs
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        if (this.$Category.categories.getValue() !== null) {
          this.buildTree();
        }
      })
  }

  get cat() {
    return this.$Category.categories.getValue();
  }

  get faq() {
    return this.$Faq.faqs.getValue();
  }

  get tree(): BehaviorSubject<ICategory> {
    return this._tree;
  }

  get treeCategories(): ICategory[] {
    return this._treeCategories;
  }

  get isBuilt(): boolean {
    return this._treeCategories !== null;
  }

  public buildTree() {
    let categories: ICategory[] = this.cat;
    let faqs = this.faq;

    if (!categories.find(c => c.id === this.$General.homeId)) {
      categories.push(<ICategory> this.$General.defaultHome);
    }

    let preparedCategories = this.prepareCategories(categories, faqs);

    preparedCategories
      .filter(c => c.type === 'category')
      .forEach((category) => {
        category.categories = [
          ...categories
            .filter(c => c.parent_id === category.id)
            .sort((a, b) => a.sort_order - b.sort_order)
        ];
      });

    let home = preparedCategories.find(c => c.id === this.$General.homeId);
    home.categories = [
      ...preparedCategories
        .filter(c => c.parent_id === this.$General.homeId)
        .sort((a, b) => a.sort_order - b.sort_order)
    ];

    this._treeCategories = preparedCategories;
    this.tree.next(this.findCurrentCategory());
  }

  public findCurrentCategory(slug: string = this._slug): ICategory {
    return this._treeCategories.find(c => c.slug === slug);
  }

  getTree(slug: string) {
    this._slug = slug;
    if (!this.isBuilt) {
      this.$Category.getAll(this.$Session.systemLang.data.code);
    } else {
      this.tree.next(this.findCurrentCategory(slug));
    }
  }

  rebuildTree() {
    this.$Category.getAll(this.$Session.systemLang.data.code);
    this.$Faq.getAll(this.$Session.systemLang.data.code);
  }

  private prepareCategories(categories: ICategory[], faqs: IFaq[]): ICategory[] {
    let homeName = categories.find(c => c.id === this.$General.homeId).name;

    categories.map((category) => {
      if (category.type !== 'home') {
        category.parent = {...categories.find(c => c.id === category.parent_id)};
      }

      category.categories = [];

      category.faqs = faqs
        .filter(f => this.$General.isAdminPanel ? f.status !== 'trash' : f.status === 'published')
        .filter(f => f.categoryId === category.id)
        .sort((a, b) => a.sort_order - b.sort_order);

      category.hierarchical.lvl0 = homeName;

      if (category.parent) {
        switch (category.type) {
          case 'category':
            category.hierarchical.lvl1 = [homeName, category.name].join(' > ');
            break;
          case 'subcategory':
            category.hierarchical.lvl1 = [homeName, category.parent.name].join(' > ');
            category.hierarchical.lvl2 = [homeName, category.parent.name, category.name].join(' > ');
            break;
        }
      }
      return {...category};
    });

    return categories;
  }
}
