import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../../services/category.service';
import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';

import { ILang } from '../../interfaces/i-lang';
import { ICategory } from '../../interfaces/i-category';
import { IFormOptions } from '../../interfaces/i-form-options';
import { Observable } from 'rxjs/Observable';
import { TreeUntranslateService } from '../../services/tree-untranslate.service';


@Component({
  selector: 'ma-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;

  category: ICategory;
  newCategory: any;
  parentCategory: ICategory;
  categories: ICategory[] = [];
  languages: Observable<ILang[]>;
  type: string;
  lang: string;
  categoryId: number;
  isCategory = false;
  categoryLang: string;
  defaultSystemLang: string;

  private _categoriesSub: AnonymousSubscription;
  private _defaultLangSub: AnonymousSubscription;

  constructor(private $Category: CategoryService,
              private $Setting: SettingService,
              private $Toast: ToastService,
              private $TreeUntranslate: TreeUntranslateService,
              public $Modal: NgbActiveModal) {
    this.languages = this.$Setting.getallowlanguages;
    this.$Category.getUntranslatedCategories();
  }

  ngOnInit() {
    this._defaultLangSub = this.$Setting.lang
      .subscribe((language: ILang) => {
        this.defaultSystemLang = language.code;
        this.$Category.getAll(this.defaultSystemLang);
      });

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

    this.type = this.parentCategory.type === 'home' ? 'category' : 'subcategory';
    this.newCategory = this.$Category.newCategory(this.parentCategory);
    this.categoryForm.patchValue(this.newCategory);
    if (this.$Setting.accessibility.getValue()[0].status === 'private' && this.parentCategory.slug === 'home') {
      this.newCategory.visibility = 'private';
      this.categoryForm.patchValue(this.newCategory);
    }
    if (this.lang && this.categoryId) {
      this.categoryForm.patchValue({lang: this.lang});
      this.isCategory = true;
    }

    this._categoriesSub = this.$Category.categories
      .subscribe(res => {
        if (res === null) {
          return;
        }
        this.categories = res.filter((cat) => (cat.parent_id === 1 || cat.parent_id === 0));
        if (this.categoryId && !this.categoryLang) {
          this.newCategory.visibility = res.filter((cat) => (cat.id === this.categoryId))[0].visibility;
          this.categoryForm.patchValue({visibility: this.newCategory.visibility});
          this.newCategory.granted_access = res.filter((cat) => (cat.id === this.categoryId))[0].granted_access;
        }
        if (this.categoryId && this.categoryLang) {
          let categories = this.$Category.categoriesUntranslated.getValue();
          this.newCategory.visibility = categories.filter((cat) => (cat.id === this.categoryId))[0].visibility;
          this.categoryForm.patchValue({visibility: this.newCategory.visibility});
          if (this.$Setting.accessibility.getValue()[0].status === 'private' && this.parentCategory.slug === 'home') {
            this.newCategory.visibility = 'private';
            this.categoryForm.patchValue(this.newCategory);
          }
          this.newCategory.granted_access = categories.filter((cat) => (cat.id === this.categoryId))[0].granted_access;
        }
      });

  }

  ngOnDestroy() {
    this._categoriesSub.unsubscribe();
  }

  submit() {
    if (this.isCategory === true) {
      this.$Category.createTranslation(this.categoryId, {
        name: this.categoryForm.getRawValue().name,
        lang: this.lang,
        parent_id: this.parentCategory.id,
        author: this.categoryForm.getRawValue().author
      }).then(() => {
        this.$TreeUntranslate.rebuildTree();
        this.$Toast.success(`MESSAGES.${this.type.toUpperCase()}_CREATE`);
        this.$Modal.close();
      })
        .catch((error) => {
          this.$Toast.showServerErrors(error);
        });
    } else {
      if ( this.categoryForm.getRawValue().visibility === 'private' && this.newCategory.granted_access.length < 1) {
        this.$Toast.error('MESSAGES.CHECK_USER');
        return;
      }
      this.$Category.create({
        granted_access: this.newCategory.granted_access,
        ...this.categoryForm.getRawValue()
      })
        .then(() => {
          this.$Toast.success(`MESSAGES.${this.type.toUpperCase()}_CREATE`);
          this.$Modal.close();
        })
        .catch((error) => {
          this.$Toast.showServerErrors(error);
        });
    }
  }

  changeParentId(cat: IFormOptions) {
    this.parentCategory = this.categories.find(c => c.id === cat.value);
    this.categoryForm.patchValue({visibility: this.parentCategory.visibility});
    this.newCategory.allowed_visibilities = this.$Category
      .getChildVisibility(this.parentCategory.visibility, this.parentCategory.allowed_visibilities);
  }


}
