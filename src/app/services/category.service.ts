import {Injectable, Injector} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {UrlService} from './url.service';
import {AuthService} from './auth.service';

import {ICategory} from '../interfaces/i-category';
import {ICategoryResponse} from '../interfaces/i-category-response';
import {IFaqVisibility} from '../interfaces/i-faq-visibility';
import {ICategoryRequest} from '../interfaces/i-category-request';
import {ICategoryTranslation} from '../interfaces/i-category-translation';
import {GeneralService} from './general.service';
import {SessionService} from './session.service';

@Injectable()
export class CategoryService {
  private enISO = 'en-gb';
  private _categories: BehaviorSubject<ICategory[]>;
  private _categoriesUntranslated: BehaviorSubject<ICategory[]>;
  private _categoriesTranslate: BehaviorSubject<ICategory[]>;

  constructor(private $Url: UrlService,
              private $http: Http,
              private $Session: SessionService,
              private $Injector: Injector,
              private  $Auth: AuthService) {
    this._categories = new BehaviorSubject(null);
    this._categoriesUntranslated = new BehaviorSubject(null);
    this._categoriesTranslate = new BehaviorSubject(null);
  }


  get $General() {
    return this.$Injector.get(GeneralService);
  }


  get categoriesTranslate(): BehaviorSubject<ICategory[]> {
    return this._categoriesTranslate;
  }

  get categoriesUntranslated(): BehaviorSubject<ICategory[]> {
    return this._categoriesUntranslated;
  }

  get categories(): BehaviorSubject<ICategory[]> {
    return this._categories;
  }


  dataToRequest(category: ICategory | ICategoryRequest): ICategoryRequest {
    return {
      name: category.name,
      parent_id: category.parent_id,
      lang: category.lang,
      author: category.author,
      sort_order: category.sort_order,
      author_href: '',
      granted_access: category.granted_access,
      visibility: category.visibility
    };
  };

  responseToData(categoryResponse: ICategoryResponse): ICategory {
    let category: ICategory = {...categoryResponse};
    if (!category) {
      return;
    }
    category.id = +category.id;
    category.sort_order = +category.sort_order;
    category.parent_id = +category.parent_id;
    category.created_at = +category.created_at;
    switch (category.parent_id) {
      case 0:
        category.type = 'home';
        break;
      case 1:
        category.type = 'category';
        break;
      default:
        category.type = 'subcategory';
        break;
    }

    category.language = category.lang;
    category.translation = category.translation || [];
    category.granted_access = category.granted_access || [];
    category.author = category.author || 'Unknown';
    category.myTranslation = {};
    category.translation.forEach((cat) => {
      category.myTranslation[cat.lang.code] = cat
    });
    category.hierarchical = {
      lvl0: null,
      lvl1: null,
      lvl2: null,
    };

    // TODO: find another way for "view all"
    // for view all on the visitor page
    category.showFaq = 6;

    return category;
  };

  newCategory(parentCategory: ICategory | ICategoryResponse): ICategoryRequest {
    let type;
    switch (parentCategory.id) {
      case 0:
        type = 'home';
        break;
      case 1:
        type = 'category';
        break;
      default:
        type = 'subcategory';
        break;
    }
    return {
      name: '',
      parent_id: +parentCategory.id || 1,
      lang: this.$Session.systemLang.data.code,
      author: this.$Auth.getFullName() || 'Unknown',
      sort_order: 0,
      author_href: '',
      granted_access: parentCategory.granted_access.map(id => id) || [],
      visibility: parentCategory.visibility,
      allowed_visibilities: this.getChildVisibility(parentCategory.visibility, parentCategory.allowed_visibilities),
      type: type,
      groups: []
    };
  };

  getLink(category: ICategory, sitePart: string = 'admin'): string[] {
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
    if (category.lang.code === 'en') {
      switch (category.type) {
        case 'home':
          return [url];
        case 'category':
          return [url, this.enISO, category.slug];
        case 'subcategory':
          return [url, this.enISO, category.parent_slug, category.slug];
      }
    } else {
      switch (category.type) {
        case 'home':
          return [url];
        case 'category':
          return [url, category.lang.code, category.slug];
        case 'subcategory':
          return [url, category.lang.code, category.parent_slug, category.slug];
      }
    }
  };

  getChildVisibility(visibility: string, allowedVisibility: IFaqVisibility[]): IFaqVisibility[] {
    switch (visibility) {
      case 'public':
        return allowedVisibility;
      case 'internal':
        return allowedVisibility.filter(v => v.code === 'internal' || v.code === 'private');
      case 'private':
        return allowedVisibility.filter(v => v.code === 'private');
    }
  }

  getAll(language: string): void {
    this.$http.get(`${this.$Url.apiUrl}/categories`, this.$General.getHeadersLang(language))
      .map(res => res.json().data.map((c: ICategoryResponse) => this.responseToData(c)) as ICategory[])
      .subscribe((result) => {
        this._categories.next(result);
      })
  };

  getById(categoryId: number | string): Observable<ICategory> {
    return this.$http.get(`${this.$Url.apiUrl}/categories/${categoryId}`)
      .map(res => {
        let cat: ICategoryResponse = res.json().data;
        if (Array.isArray(cat) && !cat.length) {
          throw Observable.throw({status: 404});
        }
        return this.responseToData(cat);
      })
  };


  getBySlug(slug: string): Observable<ICategory> {
    return this.$http.get(`${this.$Url.apiUrl}/categories/${slug}`)
      .map(res => {
        let cat: ICategoryResponse = res.json().data;
        if (Array.isArray(cat) && !cat.length) {
          throw Observable.throw({status: 404});
        }
        return this.responseToData(cat);
      })
  };

  create(newCategory: ICategoryRequest): Promise<ICategory> {
    return this.$http.post(
      `${this.$Url.apiUrl}/categories`,
      this.dataToRequest(newCategory)
    )
      .map(res => res.json().data as ICategoryResponse)
      .toPromise()
      .then(result => {
        this.getAll(this.$Session.systemLang.data.code);
        this.getUntranslatedCategories();
        return this.responseToData(result);
      });
  };

  update(category: ICategory): Promise<ICategory> {
    return this.$http.put(
      `${this.$Url.apiUrl}/categories/${category.id}`,
      this.dataToRequest(category)
    )
      .map(res => res.json().data as ICategoryResponse)
      .toPromise()
      .then(result => {
        this.getAll(this.$Session.systemLang.data.code);
        this.getUntranslatedCategories();
        return this.responseToData(result);
      });
  };

  changeOrder(oder: { id: number, order: number }[]): Promise<any> {
    return this.$http.post(`${this.$Url.apiUrl}/categories/sortOrder`, oder)
      .map(res => res.json().data as ICategoryResponse)
      .toPromise()
  };

  remove(categoryId: number): Promise<any> {
    return this.$http.delete(`${this.$Url.apiUrl}/categories/${categoryId}`)
      .map(res => res.json().data as ICategoryResponse)
      .toPromise()
      .then(result => {
        this.getAll(this.$Session.systemLang.data.code);
        return result
      });
  };

  createTranslation(id: number, data: ICategoryTranslation): Promise<ICategory> {
    return this.$http.post(
      `${this.$Url.apiUrl}/categories/${id}/translations`, data
    )
      .map(res => this.responseToData(res.json().data))
      .toPromise()
      .then((result) => {
        this.getAll(this.$Session.systemLang.data.code);
        return result;
      });
  };

  checkTranslatedCategory(id: number, language: string) {
    return this.$http.get(`${this.$Url.apiUrl}/categories/${id}/translations/${language}`)
      .map(res => res.json().data)
      .toPromise();
  }

  getCategoriesForLang(language: string): Promise<ICategory[]> {
    return this.$http.get(`${this.$Url.apiUrl}/categories`, this.$General.getHeadersLang(language))
      .map(res => res.json().data.map((c: ICategoryResponse) => this.responseToData(c)) as ICategory[])
      .toPromise()
      .then((result) => {
        this._categoriesTranslate.next(result);
        return result
      })
  }

  getUntranslatedCategories() {
    this.$http.get(`${this.$Url.apiUrl}/translations/untranslated/categories`)
      .map(res => res.json().data.map((c: ICategoryResponse) => this.responseToData(c)) as ICategory[])
      .subscribe((result) => {
        this._categoriesUntranslated.next(result);
      })
  }
}
