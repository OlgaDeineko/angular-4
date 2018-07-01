import { Injectable } from '@angular/core';
import { TreeService } from './tree.service';
import { CategoryService } from './category.service';
import { FaqService } from './faq.service';
import { GeneralService } from './general.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ICategory } from '../interfaces/i-category';
import {SessionService} from './session.service';

@Injectable()
export class TreeUntranslateService extends TreeService {

  private _treeTranslate: BehaviorSubject<ICategory>;
  constructor($Category: CategoryService,
              $Faq: FaqService,
              $Session: SessionService,
              $General: GeneralService) {
    super($Category, $Faq, $Session, $General);
  }
  init() {
    this._treeTranslate = new BehaviorSubject(null);

    this.$Category.categoriesUntranslated
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        if (this.$Faq.faqsUntranslated.getValue() !== null) {
          this.buildTree();
        }
      });

    this.$Faq.faqsUntranslated
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        if (this.$Category.categoriesUntranslated.getValue() !== null) {
          this.buildTree();
        }
      })
  }

  get cat(){
    return this.$Category.categoriesUntranslated.getValue();
  }
  get faq() {
    return this.$Faq.faqsUntranslated.getValue();
  }

  get tree(): BehaviorSubject<ICategory> {
    return this._treeTranslate;
  }


  getTree(slug: string) {
    this._slug = slug;
    if (!this.isBuilt) {
      this.$Category.getUntranslatedCategories();
      this.$Faq.getUntranslatedFaq();
    } else {
      this.tree.next(this.findCurrentCategory(slug));
    }
  }

  rebuildTree() {
    this.$Category.getUntranslatedCategories();
    this.$Faq.getUntranslatedFaq();
  }
}
