import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../../services/setting.service';
import { ToastService } from '../../services/toast.service';
import { CategoryService } from '../../services/category.service';
import { FaqService } from '../../services/faq.service';
import { IFaq } from '../../interfaces/i-faq';
import { CreateCategoryTranslationComponent } from '../../modals/create-category-translation/create-category-translation.component';
import { CreateCategoryComponent } from '../../modals/create-category/create-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICategory } from '../../interfaces/i-category';
import { EditCategoryComponent } from '../../modals/edit-category/edit-category.component';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {ILang} from '../../interfaces/i-lang';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'ma-untranslated',
  templateUrl: './untranslated.component.html',
  styleUrls: ['./untranslated.component.scss']
})
export class UntranslatedComponent implements OnInit {
  faqResults: IFaq[];
  faqs: IFaq[];
  categoryResults: any;
  categories: any;
  itemResults: any;
  searchModel = '';
  lang: ILang = {code: 'nl', name: 'Dutch'};
  items: any;
  constructor(private $Category: CategoryService,
              private $Faq: FaqService,
              private $Toast: ToastService,
              public $Setting: SettingService,
              private $Session: SessionService,
              private $Router: Router,
              private $Modal: NgbModal) {
  }

  ngOnInit() {
    this.lang = this.$Session.systemLang.data;

    this.$Category.categoriesUntranslated
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        this.categories = this.prepareCategories(res);
        this.items = this.categories.concat(this.faqs);
      });

    this.$Faq.faqsUntranslated
      .subscribe((res) => {
        if (res === null) {
          return;
        }
        this.faqs = res;
        this.items = this.categories.concat(this.faqs);
      })
  }

  search() {
    this.faqResults = this.filterFaq(this.searchModel.trim(), '!trash', 1);

    this.categoryResults = this.categories
      .filter(c => c.name.search(this.searchModel.trim()) !== -1);
    this.itemResults = this.categoryResults.concat(this.faqResults);
  }

  filterFaq(search: string, status: string, parentCategoryId: number) {
    let faqs = this.faqs;
    if (!faqs) {
      return [];
    }
    faqs = faqs
    // status
      .filter(f => {
        if (!status || status.length === 0) {
          return true
        }
        if (status[0] === '!') {
          return f.status !== status.slice(1);
        } else {
          return f.status === status;
        }
      })
      // search
      .filter(f => {
        if (search) {
          return f.question.search(search) !== -1
        } else {
          return true;
        }
      })
    return faqs;
  }

  createTranslation(item, type: string, code: string) {
    switch (type) {
      case 'category':
        let createCategoryModal = this.$Modal.open(CreateCategoryComponent);
        createCategoryModal.componentInstance.parentCategory = item.parent;
        createCategoryModal.componentInstance.lang = code;
        createCategoryModal.componentInstance.categoryLang = item.lang.code;
        createCategoryModal.componentInstance.categoryId = item.id;
        break;
      case 'subcategory':
        this.$Category.checkTranslatedCategory(item.id, code).then((res) => {
          let createTranslationCategoryModal = this.$Modal.open(CreateCategoryTranslationComponent);
          createTranslationCategoryModal.componentInstance.parentCategories = res;
        });
        break;
      case 'faq':
        this.$Category.checkTranslatedCategory(item.categoryId, code).then((res) => {
          if (res.translated === false && res.target_category_id !== 1) {
            let createCategoryModalForFAQ = this.$Modal.open(CreateCategoryTranslationComponent);
            createCategoryModalForFAQ.componentInstance.parentCategories = res;
            createCategoryModalForFAQ.result.then((result) => {
              this.$Router.navigate(['/admin/createFAQ'], {
                queryParams: {
                  categoryId: result.id,
                  faqId: item.id,
                  faqLangCode: code,
                }
              });
            }).catch((error) => {
            })
          } else {
            if (res.target_category_id !== 1) {
              switch (res.translation.length) {
                case 1:
                  this.$Router.navigate(['/admin/createFAQ'], {
                    queryParams: {
                      categoryId: res.translation[0].translated.id,
                      faqId: item.id,
                      faqLangCode: code,
                    }
                  });
                  break;
                case 2:
                  this.$Router.navigate(['/admin/createFAQ'], {
                    queryParams: {
                      categoryId: res.translation[1].translated.id,
                      faqId: item.id,
                      faqLangCode: code,
                    }
                  });
                  break;
              }
            } else {
              this.$Router.navigate(['/admin/createFAQ'], {
                queryParams: {
                  categoryId: item.categoryId,
                  faqId: item.id,
                  faqLangCode: code,
                }
              });
            }
          }
        }).catch((error) => {
          this.$Toast.showServerErrors(error);
        });
        break;
    }
  }

  generateLink(item: IFaq): string[] {
    if (item.question) {
      return this.$Faq.getLink(item, 'translates');
    }
  }

  prepareCategories(categories: ICategory[]): ICategory[] {

    categories.map((category) => {
      if (category.type !== 'home') {
        category.parent = {...categories.find(c => c.id === category.parent_id)};
      }
      category.categories = [];
      return {...category};
    });

    return categories;
  }

  remove(type: string, id: number) {
    if (type === 'faq') {
      this.$Faq.remove(id)
        .then(() => {
          this.$Faq.getUntranslatedFaq();
          this.$Category.getUntranslatedCategories();
        });
    } else {
      this.$Category.remove(id)
        .then(() => {
          this.$Faq.getUntranslatedFaq();
          this.$Category.getUntranslatedCategories();
        });
    }
  }
}
