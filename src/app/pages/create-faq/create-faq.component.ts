import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AnonymousSubscription} from 'rxjs/Subscription';
// constants
import {DOC_FILE_TYPES} from '../../constants';
// services
import {FaqService} from '../../services/faq.service';
import {CategoryService} from '../../services/category.service';
import {SettingService} from '../../services/setting.service';
import {FileService} from '../../services/file.service';
import {ToastService} from '../../services/toast.service';
// interfaces
import {ICategory} from '../../interfaces/i-category';
import {ILang} from '../../interfaces/i-lang';
import {ICommonSettings} from '../../interfaces/i-common-settings';
import {IFaqStatuses} from '../../interfaces/i-faq-statuses';
import {INewFile} from '../../interfaces/i-new-file';
import {IFileRemove} from '../../interfaces/i-file-remove';


@Component({
  selector: 'ma-create-faq',
  templateUrl: './create-faq.component.html',
  styleUrls: ['./create-faq.component.scss', '../faq/faq.component.scss']
})
export class CreateFaqComponent implements OnInit, OnDestroy {

  categories: ICategory[] = [];
  filesBase64: INewFile[] = [];
  removedFiles: IFileRemove[] = [];
  languages: ILang[];
  defaultLang: ILang;
  faqStatuses: IFaqStatuses[];
  new_tags: string[];

  parentCategory: ICategory;
  faq: any;
  isFaq = false;
  oneExists = false;

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
    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | media | forecolor backcolor emoticons | codesample | code spellchecker| | infomessage successmessage warningmessage errormessage',
    image_advtab: true,
    relative_urls: false,
    paste_data_images: true,
    image_dimensions: false,
    image_class_list: [
      {title: 'Responsive', value: 'img-responsive'}
    ]
  };

  private _routeParamsSub: AnonymousSubscription;
  private _langSub: AnonymousSubscription;
  private _languagesSettingsSub: AnonymousSubscription;
  private _defaultLangSub: AnonymousSubscription;
  private _commonSettingsSub: AnonymousSubscription;
  private _categoriesSub: AnonymousSubscription;

  constructor(private $Faq: FaqService,
              private $Category: CategoryService,
              private $Setting: SettingService,
              private $File: FileService,
              private $Route: ActivatedRoute,
              private $Router: Router,
              private $Toast: ToastService) {
    this.checkFile = this.checkFile.bind(this);
  }

  ngOnInit() {
    this._routeParamsSub = this.$Route.queryParamMap
      .subscribe(res => {
        this.$Category.getById(res.get('categoryId') || 1)
          .subscribe(category => {
            this.parentCategory = category;
            this.faq = this.$Faq.newFaq(this.parentCategory);
            this._defaultLangSub = this.$Setting.lang.subscribe((result) => {
              this._languagesSettingsSub = this.$Setting.getallowlanguages
                .subscribe((languages: ILang[]) => {
                  this.languages = languages;
                });
              if (result.name) {
                this.defaultLang = result;
                this.faq.lang = this.defaultLang;
              }else {
                return;
              }
            });
            if (this.$Setting.accessibility.getValue()[0].status === 'private' && this.parentCategory.slug === 'home') {
              this.faq.visibility = 'private';
            }
            if (res.get('faqLangCode')) {
              this.$Category.getCategoriesForLang(res.get('faqLangCode'));
            } else {
              this.$Category.getCategoriesForLang(this.parentCategory.lang.code);
            }
            this._categoriesSub = this.$Category.categoriesTranslate.subscribe((r) => {
              if (r === null) {
                return;
              }
              this.categories = r;
              if (this.categories.find(c => c.id === Number(res.get('categoryId')))) {
                this.oneExists = true;
              }
            });
            if (res.get('faqId')) {
              this.$Faq.getById(Number(res.get('faqId')), false).then((result) => {
                this.faq.visibility = result.visibility;
                this.faq.granted_access = result.granted_access;
                this.faq.lang.code = res.get('faqLangCode');
                this.faq.id = res.get('faqId');
                this.isFaq = true;
                if (this.$Setting.accessibility.getValue()[0].status === 'private' && this.parentCategory.slug === 'home' && res.get('faqLangCode') && res.get('faqLangCode') === 'nl') {
                  this.faq.visibility = 'private';
                }
              });
            }
          });
      });

    this._langSub = this.$Setting.user_settings
      .subscribe((lang) => {
        this.tinymceOptions.language_url = `/assets/i18n/tinyMCE/${lang.code}.js`;
        this.tinymceOptions.language = lang.code;
      });

    this._commonSettingsSub = this.$Setting.commonSettings
      .subscribe((settings: ICommonSettings) => {
        this.faqStatuses = settings.faq_statuses;
      });
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
    if (this.faq.visibility === 'private' && this.faq.granted_access.length < 1) {
      this.$Toast.error('MESSAGES.CHECK_USER');
      return;
    }

    this.$Faq.create(this.faq)
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
        this.$Toast.success(`MESSAGES.FAQ_CREATE`);
        this.$Router.navigate(this.$Faq.getLink(result, 'admin'))
      })
      .catch((error) => {
        if (error.status === 400 && JSON.parse(error._body).message.includes('is too big size')) {
          this.$Toast.errorOne('MESSAGES.IS_TOO_BIG_SIZE');
        }
        this.$Toast.showServerErrors(error);
      })
  }

  saveTranslation() {
    if (!this.faq.question || !this.faq.answer) {
      if (!this.faq.question) {
        this.$Toast.error('VALIDATION_ERRORS.NOT_QUESTION');
      }
      if (!this.faq.answer) {
        this.$Toast.error('VALIDATION_ERRORS.NOT_ANSWER');
      }
      return;
    }
    if (this.faq.tags !== '') {
      let new_tags = [];
      this.faq.tags.map((i) => {
        new_tags.push(i.name);
      });
      this.new_tags = new_tags;
    } else {
      this.new_tags = [];
    }

    let dataToRequest = {
      question: this.faq.question,
      author: this.faq.author,
      answer: this.faq.answer,
      lang: this.faq.lang.code,
      new_tags: this.new_tags,
      category_ids: [this.faq.categoryId],
      remarks: this.faq.remarks
    };
    this.$Faq.createTranslation(this.faq.id, dataToRequest).then((res) => {
        this.$Toast.success(`MESSAGES.FAQ_CREATE`);
        this.isFaq = false;
        this.$Router.navigate(this.$Faq.getLink(res, 'admin'))
      }
    ).catch((error) => {
      this.$Toast.showServerErrors(error);
    })
  }

  ngOnDestroy() {
    this._langSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
    this._defaultLangSub.unsubscribe();
    this._commonSettingsSub.unsubscribe();
    this._categoriesSub.unsubscribe();
    if (this._routeParamsSub) {
      this._routeParamsSub.unsubscribe();
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

  changeParentId(cat) {
    this.parentCategory = cat;
    this.faq.categoryId = cat.id;
    this.faq.visibility = cat.visibility;
    this.faq.allowed_visibilities = this.$Category.getChildVisibility(cat.visibility, cat.allowed_visibilities);
  }
}
