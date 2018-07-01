import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { CategoryService } from '../../services/category.service';
import {AuthService} from '../../services/auth.service';
import {TreeUntranslateService} from '../../services/tree-untranslate.service';

@Component({
  selector: 'ma-create-category-translation',
  templateUrl: './create-category-translation.component.html',
  styleUrls: ['./create-category-translation.component.scss']
})
export class CreateCategoryTranslationComponent implements OnInit {
  parentCategories: any;
  categoryTranslationForm: FormGroup;

  constructor(public $Modal: NgbActiveModal,
              private $Category: CategoryService,
              private $Auth: AuthService,
              private $TreeUntranslate: TreeUntranslateService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    if (this.parentCategories.translation.length > 1) {
      this.categoryTranslationForm = new FormGroup({
        category: new FormGroup({
          target_category_id: new FormControl(this.parentCategories.translation[0].origin.id),
          name: new FormControl(''),
          lang: new FormControl('')
        }),
        subcategory: new FormGroup({
          target_category_id: new FormControl(this.parentCategories.translation[1].origin.id),
          name: new FormControl(''),
          lang: new FormControl('')
        })
      });

      this.parentCategories.translation.forEach((t, index) => {
        // translated has 3 condition: true(has all translations) | false(has translation one of elements) | null(don't have translation)
        if (t.translated != null) {
          switch (index) {
            case 0:
              this.categoryTranslationForm.patchValue({
                category: {
                  lang: this.parentCategories.translate_to,
                  name: this.parentCategories.translation[0].translated.name
                },
              });
              break;
            case 1:
              this.categoryTranslationForm.patchValue({
                subcategory: {
                  lang: this.parentCategories.translate_to,
                  name: this.parentCategories.translation[1].translated.name
                }
              });
              break;
          }
        } else {
          switch (index) {
            case 0:
              this.categoryTranslationForm.patchValue({
                category: {lang: this.parentCategories.translate_to},
              });
              break;
            case 1:
              this.categoryTranslationForm.patchValue({
                subcategory: {lang: this.parentCategories.translate_to}
              });
              break;
          }
        }
      })
    }else {
      this.categoryTranslationForm = new FormGroup({
        category: new FormGroup({
          target_category_id: new FormControl(this.parentCategories.translation[0].origin.id),
          name: new FormControl(''),
          lang: new FormControl('')
        }),
      });
      if (this.parentCategories.translation[0].translated != null) {
        this.categoryTranslationForm.patchValue({
          category: {
            lang: this.parentCategories.translate_to,
            name: this.parentCategories.translation[0].translated.name
          },
        });
      } else {
        this.categoryTranslationForm.patchValue({
          category: {lang: this.parentCategories.translate_to},
        });
      }
    }
  }

  send() {
    if (this.categoryTranslationForm.getRawValue().subcategory) {
      if (this.parentCategories.translation[0].translated == null) {
        if (!this.categoryTranslationForm.getRawValue().category.name || !this.categoryTranslationForm.getRawValue().subcategory.name) {
          if (!this.categoryTranslationForm.getRawValue().category.name) {
            this.$Toast.error('VALIDATION_ERRORS.NOT_CATEGORY_NAME');
          }
          if (!this.categoryTranslationForm.getRawValue().subcategory.name) {
            this.$Toast.error('VALIDATION_ERRORS.NOT_SUBCATEGORY_NAME');
          }
          return;
        }
        this.$Category.createTranslation(this.categoryTranslationForm.getRawValue().category.target_category_id, {
          name: this.categoryTranslationForm.getRawValue().category.name,
          lang: this.categoryTranslationForm.getRawValue().category.lang,
          parent_id: this.parentCategories.translation[0].origin.parent_id,
          author: this.$Auth.getFullName()
        }).then((result) => {
          this.$TreeUntranslate.rebuildTree();
          this.$Toast.success(`MESSAGES.CATEGORY_CREATE`);
          if (this.parentCategories.translation[1].translated == null) {
            this.$Category.createTranslation(this.categoryTranslationForm.getRawValue().subcategory.target_category_id, {
              name: this.categoryTranslationForm.getRawValue().subcategory.name,
              lang: this.categoryTranslationForm.getRawValue().subcategory.lang,
              parent_id: result.id,
              author: this.$Auth.getFullName()
            }).then((res) => {
              this.$TreeUntranslate.rebuildTree();
              this.$Toast.success(`MESSAGES.SUBCATEGORY_CREATE`);
              this.$Modal.close(res);
            })
          }
        })
      } else {
        if (this.parentCategories.translation[1].translated == null) {
          if (!this.categoryTranslationForm.getRawValue().subcategory.name) {
            this.$Toast.error('VALIDATION_ERRORS.NOT_SUBCATEGORY_NAME');
            return;
          }
          this.$Category.createTranslation(this.categoryTranslationForm.getRawValue().subcategory.target_category_id, {
            name: this.categoryTranslationForm.getRawValue().subcategory.name,
            lang: this.categoryTranslationForm.getRawValue().subcategory.lang,
            parent_id: this.parentCategories.translation[0].translated.id,
            author: this.$Auth.getFullName()
          }).then((res) => {
            this.$TreeUntranslate.rebuildTree();
            this.$Toast.success(`MESSAGES.SUBCATEGORY_CREATE`);
            this.$Modal.close(res);
          })
        }
      }

    } else {
      if (this.parentCategories.translation[0].translated == null) {
        if (!this.categoryTranslationForm.getRawValue().category.name) {
          this.$Toast.error('VALIDATION_ERRORS.NOT_CATEGORY_NAME');
          return;
        }
        this.$Category.createTranslation(this.categoryTranslationForm.getRawValue().category.target_category_id, {
          name: this.categoryTranslationForm.getRawValue().category.name,
          lang: this.categoryTranslationForm.getRawValue().category.lang,
          parent_id: this.parentCategories.translation[0].origin.parent_id,
          author: this.$Auth.getFullName()
        }).then((res) => {
          this.$TreeUntranslate.rebuildTree();
          this.$Toast.success(`MESSAGES.CATEGORY_CREATE`);
          this.$Modal.close(res);
        })
      }
    }
  }
}
