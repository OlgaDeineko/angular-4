import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { EditCategoryComponent } from '../../../modals/edit-category/edit-category.component';

import { CategoryService } from '../../../services/category.service';
import { FaqService } from '../../../services/faq.service';
import { ToastService } from '../../../services/toast.service';

import { IFaq } from '../../../interfaces/i-faq';
import { ICategory } from '../../../interfaces/i-category';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { ILang } from '../../../interfaces/i-lang';
import { SettingService } from '../../../services/setting.service';
import { CreateCategoryTranslationComponent } from '../../../modals/create-category-translation/create-category-translation.component';
import { CreateCategoryComponent } from '../../../modals/create-category/create-category.component';
import { TreeUntranslateService } from '../../../services/tree-untranslate.service';
import {SessionService} from '../../../services/session.service';

@Component({
  selector: 'ma-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.scss']
})
export class TreeItemComponent implements OnInit, OnDestroy {

  @Input('type') type?: string;
  @Input('dragIcon') dragIcon?: boolean;
  @Input('item') item?: any;
  @Input('translates') translates?: boolean = false;

  service: any;
  icon: string;
  title: string;
  languages: ILang[];
  transLang: ILang[];
  defaultSystemLang: string;

  private _languagesSettingsSub: AnonymousSubscription;

  constructor(private $Category: CategoryService,
              private $Faq: FaqService,
              private $Modal: NgbModal,
              private $Router: Router,
              private $Session: SessionService,
              private $Setting: SettingService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    switch (this.type) {
      case 'category':
        this.service = this.$Category;
        this.icon = 'fa-folder';
        this.title = 'name';
        break;
      case 'faq':
        this.service = this.$Faq;
        this.icon = 'fa-question-circle';
        this.title = 'question';
        break;
    }
    this.defaultSystemLang = this.$Session.systemLang.data.code;

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

  generateLink(item: IFaq | ICategory): string[] {
    if (this.translates === false) {
      return this.service.getLink(item, 'admin');
    } else {
      return this.service.getLink(item, 'translates');
    }
  }

  remove(id: number) {
    this.service.remove(id)
      .then(() => {
        if (this.type === 'category') {
          this.$Faq.getAll(this.defaultSystemLang);
          this.$Faq.getUntranslatedFaq();
          this.$Category.getUntranslatedCategories();
        }
      });
  }

  edit(item, code: string = null) {
    if (item.status === 'trash' && code) {
      return
    }
    let slug = this.item.slug;
    let translation = item.translation.filter((t) => t.lang.code === code);
    if (translation.length > 0) {
      slug = translation[0].slug
    }
    switch (this.type) {
      case 'category' || 'subcategory':
        let editCategoryModal = this.$Modal.open(EditCategoryComponent);
        editCategoryModal.componentInstance.category = this.item;
        editCategoryModal.componentInstance.langCode = code;
        break;
      case 'faq':
        this.$Router.navigate(['/admin/editFAQ', slug]);
        break;
    }
  }

  copy(id: number) {
    this.$Faq.copyAsDraft(id)
      .then(() => this.$Toast.success('MESSAGES.FAQ_COPIED_AND_SAVE_DRAFT'));
  }

  toggleChildren(item) {
    if (this.type === 'faq') {
      return;
    }
    if (item.categories && item.categories.length) {
      item.expanded = !item.expanded
    }
  }

  checkTranslation(lang: ILang, item: any) {
    let bool = true;
    if (item.translation.length > 0) {
      item.translation.forEach((res) => {
        if (res.lang.code === lang.code) {
          bool = false;
        }
      })
    }
    return bool
  }

  createTranslation(item, code: string) {
    if (item.status === 'trash') {
      return
    }
    switch (item.type) {
      case 'category':
        let createCategoryModal = this.$Modal.open(CreateCategoryComponent);
        createCategoryModal.componentInstance.parentCategory = this.item.parent;
        createCategoryModal.componentInstance.lang = code;
        if (this.translates) {
          createCategoryModal.componentInstance.categoryLang = this.item.lang.code;
        }
        createCategoryModal.componentInstance.categoryId = this.item.id;
        break;
      case 'subcategory':
        this.$Category.checkTranslatedCategory(this.item.id, code).then((res) => {
          let createTranslationCategoryModal = this.$Modal.open(CreateCategoryTranslationComponent);
          createTranslationCategoryModal.componentInstance.parentCategories = res;
        });
        break;
      case 'faq':
        this.$Category.checkTranslatedCategory(this.item.categoryId, code).then((res) => {
          if (res.translated === false && res.target_category_id !== 1) {
            let createCategoryModalForFAQ = this.$Modal.open(CreateCategoryTranslationComponent);
            createCategoryModalForFAQ.componentInstance.parentCategories = res;
            createCategoryModalForFAQ.result.then((result) => {
              this.$Router.navigate(['/admin/createFAQ'], {
                queryParams: {
                  categoryId: result.id,
                  faqId: this.item.id,
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
                      faqId: this.item.id,
                      faqLangCode: code,
                    }
                  });
                  break;
                case 2:
                  this.$Router.navigate(['/admin/createFAQ'], {
                    queryParams: {
                      categoryId: res.translation[1].translated.id,
                      faqId: this.item.id,
                      faqLangCode: code,
                    }
                  });
                  break;
              }
            } else {
              this.$Router.navigate(['/admin/createFAQ'], {
                queryParams: {
                  categoryId: this.item.categoryId,
                  faqId: this.item.id,
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

  ngOnDestroy() {
    this._languagesSettingsSub.unsubscribe();
  }
}
