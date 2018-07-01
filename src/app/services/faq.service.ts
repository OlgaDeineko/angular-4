import {Injectable, Injector} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {UrlService} from './url.service';
import {AuthService} from './auth.service';
import {SettingService} from './setting.service';
import {CategoryService} from './category.service';
import {UsersService} from './users.service';
import {FileService} from './file.service';

import {ICategory} from '../interfaces/i-category';
import {IFaqRequest} from '../interfaces/i-faq-request';
import {INewFaq} from '../interfaces/i-new-faq';
import {IFaq} from '../interfaces/i-faq';
import {IFaqResponse} from '../interfaces/i-faq-response';
import {INewFile} from '../interfaces/i-new-file';
import {IFile} from '../interfaces/i-file';
import {IFaqCount} from '../interfaces/i-faq-count';
import {IFaqTranslation} from '../interfaces/i-faq-translation';
import {GeneralService} from './general.service';
import {SessionService} from './session.service';

@Injectable()
export class FaqService {

  private _faqs: BehaviorSubject<IFaq[]>;
  private _faqsUntranslated: BehaviorSubject<IFaq[]>;
  private _faqsTrash: BehaviorSubject<IFaq[]>;
  private _faqsTranslate: BehaviorSubject<IFaq[]>;
  private _filteredFaqs: BehaviorSubject<IFaq[]>;
  private _faqCounts: BehaviorSubject<IFaqCount[]>;
  private enISO = 'en-gb';


  constructor(private $Url: UrlService,
              private $http: Http,
              private $Auth: AuthService,
              private $Setting: SettingService,
              private $Session: SessionService,
              private $Category: CategoryService,
              private $Users: UsersService,
              private $Injector: Injector,
              private $File: FileService) {
    this._faqs = new BehaviorSubject(null);
    this._faqsTranslate = new BehaviorSubject(null);
    this._faqsUntranslated = new BehaviorSubject(null);
    this._faqsTrash = new BehaviorSubject(null);
    this._filteredFaqs = new BehaviorSubject([]);
    this._faqCounts = new BehaviorSubject([]);
  }

  get $General() {
    return this.$Injector.get(GeneralService);
  }


  dataToRequest(faq: INewFaq | IFaq): IFaqRequest {
    let new_tags = [];
    let tag_ids = [];

    faq.tags.map((i) => {
      if (i.tag_id) {
        tag_ids.push(i.tag_id);
      } else {
        new_tags.push(i.name);
      }
    });

    let category_ids = [faq.categoryId];

    let userRole = this.$Auth.getRole();
    if (!faq.granted_access.length && userRole && userRole !== 'editor' && userRole !== 'contributor') {
      this.$Users.getAll().then((users) => {
        faq.granted_access = users.map((u) => u.id);
      })
    }

    return {
      question: faq.question,
      answer: String(faq.answer).replace(/\n/g, ''),
      visibility: faq.visibility,
      is_open_comments: faq.is_open_comments,
      lang: (<any>faq.lang).code,
      author: faq.author,
      status: faq.status,
      new_tags: new_tags,
      tag_ids: tag_ids,
      category_ids: category_ids,
      remarks: faq.remarks,
      author_href: '',
      granted_access: faq.granted_access
    };
  };

  responseToData(faqResponse: IFaqResponse): IFaq {
    let faq: IFaq = {...faqResponse};
    faq.created_at = +faq.created_at;

    // faq.category = {};
    if (Array.isArray(faq.categories) && faq.categories.length) {
      faq.category = this.$Category.responseToData(faq.categories[0]);
      faq.categoryId = faq.category.id;
      faq.categorySlug = faq.category.slug;
    }

    faq.language = faq.lang;

    if (Array.isArray(faq.attachments)) {
      faq.attachments.map(f => this.$File.responseToData(f));
    }

    // replace all new line symbol to <br>
    faq.answer = String(faq.answer).replace(/(\r\n|\n)/g, '<br>');

    // counting words and character in article answer
    faq.answerWithoutTags = String(faq.answer).replace(/<[^>]+>/gm, ' ');
    faq.answerWithoutTags = faq.answerWithoutTags.replace(/\s{2,}/g, ' ');
    faq.answerWithoutTags = faq.answerWithoutTags.replace(/^\s+|\s+$/g, '');

    faq.granted_access = faq.granted_access || [];

    faq.isOwner = this.$Auth.getId() === faq.author_href;

    faq.hits_count = +faq.hits_count;
    faq.type = 'faq';

    return faq;
  };

  newFaq(parentCategory: ICategory): INewFaq {
    return {
      question: '',
      answer: '',
      categoryId: +parentCategory.id || 1,
      tags: [],
      visibility: parentCategory.visibility,
      author: this.$Auth.getFullName() || 'Unknown',
      groups: [],
      is_open_comments: true,
      status: 'draft',
      remarks: '',
      granted_access: parentCategory.granted_access.map(id => id) || [],
      allowed_visibilities: this.$Category.getChildVisibility(parentCategory.visibility, parentCategory.allowed_visibilities),
      type: 'faq'
    };
  };

  countsTypes(trash: IFaq[], faqs: IFaq[]) {
    this.$Setting.commonSettings
      .subscribe((settings) => {
        if (!settings) {
          return
        }
        let articlesCounts = [];
        articlesCounts.push({
          name: 'ALL',
          code: 'all',
          counts: faqs.filter((faq) => faq.status !== 'trash').length
        });

        settings.faq_statuses.map((status) => {
          if (status.code === 'trash') {
            articlesCounts.push({
              name: status.name.toUpperCase(),
              code: status.code,
              counts: trash.length
            });
          } else {
            articlesCounts.push({
              name: status.name.toUpperCase(),
              code: status.code,
              counts: faqs.filter((faq) => faq.status === status.code).length
            });
          }
        });
        this._faqCounts.next(articlesCounts);
      });
  };

  getLink(faq: IFaq, sitePart: string = 'admin'): string[] {
    let url = '/';
    switch (sitePart) {
      case 'admin':
        url = '/admin';
        break;
      case 'visitor':
        url = '/';
        break;
      case 'translates':
        url = '/admin/untranslated';
        break;
    }
    if (faq.lang.code === 'en') {
      switch (faq.category.type) {
        case 'home':
          return [url, this.enISO, 'faq', faq.slug];
        case 'category':
          return [url, this.enISO, faq.category.slug, 'faq', faq.slug];
        case 'subcategory':
          return [url, this.enISO, faq.category.parent_slug, faq.category.slug, 'faq', faq.slug];
      }
    } else {
      switch (faq.category.type) {
        case 'home':
          return [url, faq.lang.code, 'faq', faq.slug];
        case 'category':
          return [url, faq.lang.code, faq.category.slug, 'faq', faq.slug];
        case 'subcategory':
          return [url, faq.lang.code, faq.category.parent_slug, faq.category.slug, 'faq', faq.slug];
      }
    }
    // let faqSlug;
    // if (faq.custom_slug) {
    //   faqSlug = faq.custom_slug;
    // } else {
    //   faqSlug = faq.slug;
    // }
    //
    // if (faq.lang.code === 'en') {
    //   switch (faq.category.type) {
    //     case 'home':
    //       return [url, this.enISO, 'faq', faqSlug];
    //     case 'category':
    //       return [url, this.enISO, faq.category.slug, 'faq', faqSlug];
    //     case 'subcategory':
    //       return [url, this.enISO, faq.category.parent_slug, faq.category.slug, 'faq', faqSlug];
    //   }
    // } else {
    //   switch (faq.category.type) {
    //     case 'home':
    //       return [url, faq.lang.code, 'faq', faqSlug];
    //     case 'category':
    //       return [url, faq.lang.code, faq.category.slug, 'faq', faqSlug];
    //     case 'subcategory':
    //       return [url, faq.lang.code, faq.category.parent_slug, faq.category.slug, 'faq', faqSlug];
    //   }
    // }
  };


  get faqs(): BehaviorSubject<IFaq[]> {
    return this._faqs;
  }

  get faqsTranslate(): BehaviorSubject<IFaq[]> {
    return this._faqsTranslate;
  }

  get faqsUntranslated(): BehaviorSubject<IFaq[]> {
    return this._faqsUntranslated;
  }

  get faqsTrash(): BehaviorSubject<IFaq[]> {
    return this._faqsTrash;
  }

  get filteredFaqs(): BehaviorSubject<IFaq[]> {
    return this._filteredFaqs;
  }

  get counts(): BehaviorSubject<IFaqCount[]> {
    return this._faqCounts;
  }


  getAll(language: string) {
    this.$http.get(`${this.$Url.apiUrl}/faq`, this.$General.getHeadersLang(language))
      .map(res => res.json().data.map(a => this.responseToData(a)) as IFaq[])
      .subscribe((result) => {
        this._faqs.next(result);
        // this.getFaqTrash();
        // this.countsTypes(result);
      })
  };

  filterFaq(search: string, status: string, parentCategoryId: number) {
    let faqs = this.faqs.getValue();
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
      // parent category
      .filter(f => {
        if (parentCategoryId) {
          return f.categoryId === parentCategoryId;
        } else {
          return true;
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
    this._filteredFaqs.next(faqs);
  }

  getById(faqId: number, isAlgolia: boolean): Promise<IFaq> {
    if (isAlgolia) {
      return this.getByAlgoliaId(faqId);
    }
    return this.$http.get(`${this.$Url.apiUrl}/faq/${faqId}`)
      .map(res => this.responseToData(res.json().data))
      .toPromise();
  };

  getBySlug(slug: string): Observable<IFaq> {
    return this.$http.get(`${this.$Url.apiUrl}/faq/${slug}`)
      .map(res => this.responseToData(res.json().data))
  };

  getByAlgoliaId(algoliaId: number): Promise<IFaq> {
    return this.$http.get(`${this.$Url.apiUrl}/faq/algolia/${algoliaId}`)
      .map(res => this.responseToData(res.json().data))
      .toPromise();
  };

  create(faq: IFaq | INewFaq): Promise<IFaq> {
    return this.$http.post(
      `${this.$Url.apiUrl}/faq`,
      this.dataToRequest(faq)
    )
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((result) => {
        this.getAll(this.$Session.systemLang.data.code);
        this.getUntranslatedFaq();
        this.getFaqTrash();
        return result;
      });
  };

  update(faq: IFaq): Promise<IFaq> {
    return this.$http.put(
      `${this.$Url.apiUrl}/faq/${faq.id}`,
      this.dataToRequest(faq)
    )
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((result) => {
        this.getAll(this.$Session.systemLang.data.code);
        this.getUntranslatedFaq();
        this.getFaqTrash();
        return result;
      });
  };

  remove(faqId: number): Promise<any> {
    return this.$http.delete(`${this.$Url.apiUrl}/faq/${faqId}/trash`)
      .map(res => res.json())
      .toPromise()
      .then((result) => {
        this.getAll(this.$Session.systemLang.data.code);
        this.getFaqTrash();
        return result
      });
  };

  saveAttachments(files: INewFile[], faqId: number): Promise<IFile> {
    return this.$http.post(
      `${this.$Url.apiUrl}/faq/${faqId}/attachments`,
      {files: files.map(this.$File.dataToRequest)}
    )
      .map(res => res.json().data.map(f => this.responseToData(f)))
      .toPromise()
  };

  changeOrder(oder: { id: number, order: number }[]): Promise<any> {
    return this.$http.post(
      `${this.$Url.apiUrl}/faq/sortOrder`,
      oder
    )
      .map(res => res.json())
      .toPromise()
  };

  getMostViewed(categoryId: number, period: number, language: string): Promise<IFaq[]> {
    let params =  {
      categoryId: categoryId,
      period: period
    }
    return this.$http.get(
      `${this.$Url.apiUrl}/faq/mostViewed`, this.$General.getOptionsForMostViewedFaq(params, language)
    )
      .map(res => res.json().data.map(a => this.responseToData(a)) as IFaq[])
      .toPromise()
  };

  copyAsDraft(faqId: number): Promise<IFaq> {
    return this.getById(faqId, false)
      .then(faq => {
        faq.status = 'draft';
        faq.author = this.$Auth.getFullName();
        return this.create(faq)
      })
  }

  faqLike(id: number): Promise<any> {
    return this.$http.post(`${this.$Url.apiUrl}/faq/${id}/like`, {})
      .map(res => res.json())
      .toPromise()
  };

  faqDislike(id: number, message: string): Promise<any> {
    return this.$http.post(
      `${this.$Url.apiUrl}/faq/${id}/dislike`, {message: message || ''}
    )
      .map(res => res.json())
      .toPromise()
  };

  createTranslation(id: number, data: IFaqTranslation): Promise<IFaq> {
    return this.$http.post(
      `${this.$Url.apiUrl}/faq/${id}/translations`, data
    )
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((result) => {
        this.getAll(this.$Session.systemLang.data.code);
        return result;
      });
  };

  getFAQsForLang(language: string) {
    return this.$http.get(`${this.$Url.apiUrl}/faq`, this.$General.getHeadersLang(language))
      .map(res => res.json().data.map(a => this.responseToData(a)) as IFaq[])
      .subscribe((result) => {
        this._faqsTranslate.next(result);
      })
  };

  getUntranslatedFaq() {
    this.$http.get(`${this.$Url.apiUrl}/translations/untranslated/faq`)
      .map(res => res.json().data.map(a => this.responseToData(a)) as IFaq[])
      .subscribe((result) => {
        this._faqsUntranslated.next(result);
      })
  }

  getFaqTrash() {
    this.$http.get(`${this.$Url.apiUrl}/faq/statuses/trash`)
      .map(res => res.json().data.map(a => this.responseToData(a)) as IFaq[])
      .toPromise()
      .then((result) => {
        this._faqsTrash.next(result);
      })
  }
}
