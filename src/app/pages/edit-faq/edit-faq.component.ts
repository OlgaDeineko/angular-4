import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';
// constants
import { DOC_FILE_TYPES } from '../../constants';
// services
import { FaqService } from '../../services/faq.service';
import { CategoryService } from '../../services/category.service';
import { SettingService } from '../../services/setting.service';
import { FileService } from '../../services/file.service';
import { ToastService } from '../../services/toast.service';
// interfaces
import { ICategory } from '../../interfaces/i-category';
import { ILang } from '../../interfaces/i-lang';
import { ICommonSettings } from '../../interfaces/i-common-settings';
import { IFaqStatuses } from '../../interfaces/i-faq-statuses';
import { IFaq } from '../../interfaces/i-faq';
import { INewFile } from '../../interfaces/i-new-file';
import { IFile } from '../../interfaces/i-file';
import { IFileRemove } from '../../interfaces/i-file-remove';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCategoryTranslationComponent } from '../../modals/create-category-translation/create-category-translation.component';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'ma-edit-faq',
  templateUrl: './edit-faq.component.html',
  styleUrls: ['./edit-faq.component.scss', '../faq/faq.component.scss']
})
export class EditFaqComponent implements OnInit, OnDestroy {

  categories: ICategory[] = [];
  filesBase64: INewFile[] = [];
  removedFiles: IFileRemove[] = [];
  languages: ILang[];
  faqStatuses: IFaqStatuses[];
  disableBtn: boolean;
  mode: string;
  parentCategory: ICategory;
  faq: IFaq;

  tinymceOptions = {
    themes: 'modern',
    branding: false,
    resize: false,
    language_url: `/assets/i18n/tinyMCE/en.js`,
    language: 'en',
    height: '100%',
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace visualblocks visualchars code fullscreen',
      'insertdatetime nonbreaking save table contextmenu directionality',
      'emoticons template textcolor colorpicker textpattern imagetools codesample toc', '-linkchecker, -powerpaste, -tinymcespellchecker'
    ],
    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | media | forecolor backcolor emoticons | codesample | code spellchecker | infomessage successmessage warningmessage errormessage',
    image_advtab: true,
    relative_urls: false,
    paste_data_images: true,
    image_dimensions: false,
    image_class_list: [
      {title: 'Responsive', value: 'img-responsive'}
    ]
  };


  private _langSub: AnonymousSubscription;
  private _languagesSettingsSub: AnonymousSubscription;
  private _commonSettingsSub: AnonymousSubscription;
  private _routeSub: AnonymousSubscription;
  private _categoriesSub: AnonymousSubscription;


  constructor(private $Faq: FaqService,
              private $Category: CategoryService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $File: FileService,
              private $Route: ActivatedRoute,
              private $Router: Router,
              private $modal: NgbModal,
              private $Toast: ToastService) {
    this.$Category.getUntranslatedCategories();
    this.checkFile = this.checkFile.bind(this);
  }

  ngOnInit() {
    this._langSub = this.$Setting.user_settings
      .subscribe((lang) => {
        this.tinymceOptions.language_url = `/assets/i18n/tinyMCE/${lang.code}.js`;
        this.tinymceOptions.language = lang.code;
      });

    this._commonSettingsSub = this.$Setting.commonSettings
      .subscribe((settings: ICommonSettings) => {
        this.faqStatuses = settings.faq_statuses;
      });

    this._languagesSettingsSub = this.$Setting.getallowlanguages
      .subscribe((languages: ILang[]) => {
        if (languages.length > 0) {
          this.languages = languages;
        } else {
          this.languages = [{name: 'Dutch', code: 'nl'}];
        }
      });
    this._routeSub = this.$Route.paramMap
      .subscribe(params => {
        this.$Faq.getBySlug(params.get('faqSlug'))
          .subscribe(res => {
            this.faq = res;
            if (this.faq.status === 'published') {
              this.$Session.kbRout.data = this.$Faq.getLink(this.faq, 'visitor');
            }
            this.disableBtn = this.$Session.previousPage.data === '/admin/faq/trash' || this.faq.status === 'trash';
            this.$Category.getCategoriesForLang(this.faq.lang.code);

            this._categoriesSub = this.$Category.categoriesTranslate.subscribe((r) => {
              if (r === null) {
                return;
              }
              this.categories = r;
            });

            this.$Category.getById(this.faq.categoryId)
              .subscribe(category => {
                this.parentCategory = category;
                this.faq.allowed_visibilities = this.$Category
                  .getChildVisibility(category.visibility, category.allowed_visibilities);
              })
          });
      })
  }

  save() {
    if (!this.faq.question || !this.faq.answer) {
      if (!this.faq.question) {
        this.$Toast.error('VALIDATION_ERRORS.NOT_QUESTION');
      }
      if (!this.faq.answer) {
        this.$Toast.error('VALIDATION_ERRORS.NOT_ANSWER');
      }
      return;
    }
    if ( this.faq.visibility === 'private' && this.faq.granted_access.length < 1) {
      this.$Toast.error('MESSAGES.CHECK_USER');
      return;
    }

    this.$Faq.update(this.faq)
      .then(res => {
        if (this.filesBase64.length) {
          this.$Faq.saveAttachments(this.filesBase64, res.id)
        }

        if (this.removedFiles.length) {
          Promise.all(
            this.removedFiles
              .map((file) => {
                return this.$File.remove(file);
              })
          )
        }
        return res;
      })
      .then((result) => {
        this.$Toast.success(`MESSAGES.FAQ_UPDATE`);
        this.$Router.navigate(this.$Faq.getLink(result, 'admin'))
      })
      .catch((error) => {
        if (error.status === 400 && JSON.parse(error._body).message.includes('is too big size')) {
          this.$Toast.errorOne('MESSAGES.IS_TOO_BIG_SIZE');
        }
        this.$Toast.showServerErrors(error);
      })
  }

  goToCreateTranslation(item) {
    this.$Category.checkTranslatedCategory(this.faq.categoryId, item.code).then((res) => {
      if (res.translated === false && res.target_category_id !== 1) {
        let createCategoryModal = this.$modal.open(CreateCategoryTranslationComponent);
        createCategoryModal.componentInstance.parentCategories = res;
        createCategoryModal.result.then((result) => {
          this.$Router.navigate(['/admin/createFAQ'], {
            queryParams: {
              categoryId: result.id,
              faqId: this.faq.id,
              faqLangCode: item.code
            }
          });
        })
      } else {
        this.$Router.navigate(['/admin/createFAQ'], {
          queryParams: {
            categoryId: this.parentCategory.translation.filter((t) => t.lang.code === item.code)[0].id,
            faqId: this.faq.id,
            faqLangCode: item.code
          }
        });
      }
    }).catch((error) => {
      this.$Toast.showServerErrors(error);
    })
  }

  checkTranslation(code: string) {
    let bool = true;
    if (this.faq.lang.code === code) {
      bool = false;
    }
    if (this.faq.translation) {
      this.faq.translation.forEach((lang) => {
        if (lang.lang.code === code) {
          bool = false;
        }
      })
    }
    return bool
  }

  remove() {
    this.$Faq.remove((<IFaq>this.faq).id)
      .then(() => {
        this.$Toast.success('MESSAGES.FAQ_REMOVE');
        this.$Router.navigate(['/admin']);
      })
  }

  ngOnDestroy() {
    this._langSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
    this._commonSettingsSub.unsubscribe();
    this._categoriesSub.unsubscribe();
    if (this._routeSub) {
      this._routeSub.unsubscribe();
    }
  }

  checkFile(file: File): boolean {
    let ext = file.name.match(/\.(.{2,4})$/)[1];

    if (!~DOC_FILE_TYPES.indexOf(ext)) {
      this.$Toast.error('MESSAGES.ERROR_DOCUMENT_TYPE');
      return true;
    }
    return false;
  }

  addFile(addedFile: { file: File, base64: string }) {
    this.filesBase64.push({name: addedFile.file.name, base64: addedFile.base64});
  }

  removeFile(idx) {
    this.filesBase64.splice(idx, 1)
  }

  removeOldFile(file: IFile, index: number) {
    (<IFaq>this.faq).attachments.splice(index, 1);
    this.removedFiles.push({
      name: file.name,
      model: file.model,
      model_id: file.model_id
    })
  }

  changeParentId(cat) {
    this.parentCategory = cat;
    this.faq.categoryId = cat.id;
    this.faq.visibility = cat.visibility;
    this.faq.allowed_visibilities = this.$Category.getChildVisibility(cat.visibility, cat.allowed_visibilities);
  }
}
