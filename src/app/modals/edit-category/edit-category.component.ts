import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';

import { ILang } from '../../interfaces/i-lang';
import { ICategory } from '../../interfaces/i-category';
import { IFormOptions } from '../../interfaces/i-form-options';
import { Observable } from 'rxjs/Observable';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { CreateCategoryTranslationComponent } from '../create-category-translation/create-category-translation.component';
import { AnonymousSubscription } from 'rxjs/Subscription';

@Component({
  selector: 'ma-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  category: ICategory;
  newCategory: any;
  parentCategory: ICategory;
  categories: ICategory[] = [];
  languages: Observable<ILang[]>;
  langCode: string | null;
  type: string;
  defaultSystemLang: string;

  private _categoriesSub: AnonymousSubscription;
  private _defaultLangSub: AnonymousSubscription;
  constructor(private $Category: CategoryService,
              private $Setting: SettingService,
              private $modal: NgbModal,
              private $Toast: ToastService,
              public $Modal: NgbActiveModal) {
    this.languages = this.$Setting.getallowlanguages;
    this.isShowActionButton = this.isShowActionButton.bind(this);
  }

  ngOnInit() {
    this.categoryForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      author: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      parent_id: new FormControl('', [
        Validators.required,
      ]),
      lang: new FormControl('', [
        Validators.required
      ]),
      visibility: new FormControl('', [
        Validators.required
      ]),
    });

    this._defaultLangSub = this.$Setting.lang
      .subscribe((language: ILang) => {
        this.defaultSystemLang = language.code;
      });

    if (this.langCode !== null) {
      let slug = this.category.translation.filter((t) => t.lang.code === this.langCode)[0].slug;
      this.$Category
        .getBySlug(slug)
        .toPromise()
        .then(
          res => {
            this.newCategory = res;
            this.$Category.getCategoriesForLang(this.newCategory.lang.code);
            this._categoriesSub = this.$Category.categoriesTranslate.subscribe((result) => {
              if (result === null) {
                return;
              }
              this.categories = result;
              this.type = this.newCategory.type;
              this.newCategory.parent = this.$Category.responseToData(this.categories.find(c => +c.id === this.newCategory.parent_id));
              this.parentCategory = this.newCategory.parent;
            });
            this.type = this.newCategory.type;
            this.categoryForm.patchValue(this.newCategory);
            this.categoryForm.patchValue({lang: this.newCategory.lang.code});
          });
    } else {
      this.newCategory = this.category;
      this.parentCategory = this.category.parent;
      this.type = this.newCategory.type;
      this.$Category.getCategoriesForLang(this.newCategory.lang.code);
      this._categoriesSub = this.$Category.categoriesTranslate.subscribe((result) => {
        if (result === null) {
          return;
        }
        this.categories = result;
      });
      this.categoryForm.patchValue(this.newCategory);
      this.categoryForm.patchValue({lang: this.newCategory.lang.code});
    }
  }

  submit() {
    if ( this.categoryForm.getRawValue().visibility === 'private' && this.newCategory.granted_access.length < 1) {
      this.$Toast.error('MESSAGES.CHECK_USER');
      return;
    }
    this.$Category.update({
      granted_access: this.newCategory.granted_access,
      ...this.categoryForm.getRawValue()
    })
      .then(() => {
        this.$Toast.success(`MESSAGES.${this.type.toUpperCase()}_UPDATE`);
        this.$Category.getAll(this.defaultSystemLang);
        this.$Category.getUntranslatedCategories();
        this.$Modal.close();
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      });
  }

  changeParentId(cat: IFormOptions) {
    this.parentCategory = this.categories.find(c => c.id === cat.value);
    this.categoryForm.patchValue({visibility: this.parentCategory.visibility});
    this.newCategory.allowed_visibilities = this.$Category
      .getChildVisibility(this.parentCategory.visibility, this.parentCategory.allowed_visibilities);
  }

  isShowActionButton(option: IFormOptions) {
    let bool = true;
    if (this.newCategory.lang.code === option.value) {
      bool = false;
    }
    if (this.newCategory.translation) {
      this.newCategory.translation.forEach((lang) => {
        if (lang.lang.code === option.value) {
          bool = false;
        }
      })
    }
    return bool;
  }

  goToCreateTranslation(option: IFormOptions) {
    if (this.type === 'subcategory') {
      this.$Category.checkTranslatedCategory(this.newCategory.id, option.value.toString()).then((res) => {
        if (res.translated === false) {
          this.$Modal.close();
          let createTranslationCategoryModal = this.$modal.open(CreateCategoryTranslationComponent);
          createTranslationCategoryModal.componentInstance.parentCategories = res;
        } else {
          this.$Modal.close();
          let createCategoryModal = this.$modal.open(CreateCategoryComponent);
          createCategoryModal.componentInstance.parentCategory = this.parentCategory;
          createCategoryModal.componentInstance.lang = option.value;
          createCategoryModal.componentInstance.categoryId = this.newCategory.id;
        }
      })
    } else {
      this.$Modal.close();
      let createCategoryModal = this.$modal.open(CreateCategoryComponent);
      createCategoryModal.componentInstance.parentCategory = this.parentCategory;
      createCategoryModal.componentInstance.lang = option.value;
      createCategoryModal.componentInstance.categoryId = this.newCategory.id;
    }
  }

  ngOnDestroy() {
    this._categoriesSub.unsubscribe();
    this._defaultLangSub.unsubscribe();
  }
}
