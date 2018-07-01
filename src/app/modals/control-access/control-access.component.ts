import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {UsersService} from '../../services/users.service';
import {ToastService} from '../../services/toast.service';
import {SettingService} from '../../services/setting.service';

import {IUser} from '../../interfaces/i-user';
import {ISubdomainInfo} from '../../interfaces/i-subdomain-info';
import {IControlAccessList} from '../../interfaces/i-control-access-list';
import {TreeService} from '../../services/tree.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {GeneralService} from '../../services/general.service';
import {ILang} from '../../interfaces/i-lang';


@Component({
  selector: 'ma-control-access',
  templateUrl: './control-access.component.html',
  styleUrls: ['./control-access.component.scss']
})
export class ControlAccessComponent implements OnInit, OnDestroy {

  user: IUser;
  changedSubdomain: BehaviorSubject<ISubdomainInfo> = new BehaviorSubject(null);

  categories: IControlAccessList[];
  faqs: IControlAccessList[];
  subdomains: ISubdomainInfo[] = [];
  isKBNotShared: boolean = false;
  isKBNotPrivate: boolean = false;
  arrParentId = [];
  arrCategoryId = [];
  arrIdUnique = [];
  categoryArray = [];
  languages: ILang[];

  private _userSubdomainsSub: AnonymousSubscription;
  private _userPermitionsSub: AnonymousSubscription;
  private _languagesSettingsSub: AnonymousSubscription;

  constructor(private $Users: UsersService,
              private $Toast: ToastService,
              private $Tree: TreeService,
              private $Setting: SettingService,
              private $General: GeneralService,
              public $Modal: NgbActiveModal) {
  }

  ngOnInit() {
    this.$Users.getUserPermittedResources(this.user.id);
    this.$Users.getUserSubdomains(this.user.id);
    this._userSubdomainsSub = this.$Users.userSubdomains.subscribe((subdomains) => {
      this.user.subdomains = subdomains;
      let subArr = [];
      this.user.subdomains.forEach((sub) => {
        if (this.$Setting.subdomains.getValue().subdomains.map(x => x.subdomain).indexOf(sub.subdomain) > -1) {
          this.changeSubdomain(sub);
          subArr.push(sub);
        }
      });
      this.subdomains = this.$General.unique(subArr);
    });

    this._languagesSettingsSub = this.$Setting.getallowlanguages
      .subscribe((languages: ILang[]) => {
        this.languages = languages;
      });

    this.changedSubdomain
      .subscribe(subdomain => {
        if (!subdomain) {
          return;
        }
        this.$Users.getById(this.user.id, subdomain.subdomain)
          .subscribe(user => {

            this.$Users.getOtherSubdomainData(subdomain.subdomain)
              .then(res => {
                this._userPermitionsSub = this.$Users.userPermittedResources.subscribe((permitions) => {
                  this.categories = res[0]
                    .map(c => {
                      return {
                        id: c.id,
                        title: c.name,
                        parent_id: c.parent_id.toLocaleString(),
                        lang: c.lang.code,
                        expanded: false,
                        visibility: c.visibility,
                        translation: c.translation,
                        checked: permitions.categories.indexOf(c.id) !== -1,
                        parents: []
                      }
                    });
                  this.faqs = res[1]
                    .filter(f => f.status !== 'trash' && f.visibility === 'private')
                    .map(f => {

                      return {
                        id: f.id,
                        title: f.question,
                        parent_id: f.categories[0].id,
                        lang: f.lang.code,
                        expanded: false,
                        visibility: f.visibility,
                        translation: f.translation,
                        checked: permitions.faq.indexOf(f.id) !== -1,
                        parents: [f.categories[0].id, f.categories[0].parent_id]
                      }
                    });
                })
              })
              .then(() => {
                this.arrParentId = [];
                this.arrCategoryId = [];
                this.arrIdUnique = [];
                this.faqs.forEach((faq) => {
                  if (faq.visibility === 'private') {
                    this.arrParentId.push(faq.parent_id);
                  }
                })
              })
              .then(() => {
                this.categories.forEach((category) => {
                  if (this.arrParentId.indexOf(category.id) > -1 && category.parent_id !== '1') {
                    this.arrCategoryId.push(category.parent_id);
                  }
                });
                this.categories.forEach((category) => {
                  if (category.visibility === 'private') {
                    if (category.parent_id !== '1') {
                      this.arrCategoryId.push(category.id);
                      this.arrCategoryId.push(category.parent_id);
                    } else {
                      this.arrCategoryId.push(category.id);
                    }
                  }
                });
              })
              .then(() => {
                this.categoryArray = [];
                this.arrCategoryId = this.arrCategoryId.concat(this.arrParentId);
                this.arrIdUnique = this.$General.unique(this.arrCategoryId);
                this.categories.forEach((category) => {
                  if (this.arrIdUnique.indexOf(category.id) > -1) {
                    this.categoryArray.push(category);
                  }
                });
              })
              .then(() => {
                this.categories = this.categoryArray;
                this.isKBNotPrivate = !this.faqs.length && !this.categories.length;
                return this.categories;
              });
          });
      });
  }

  changeSubdomain(subdomain: ISubdomainInfo) {
    this.categoryArray = [];
    this.faqs = [];
    this.categories = [];
    this.isKBNotShared = false;
    this.isKBNotPrivate = false;
    if (this.user.subdomains.find(res => res.id === subdomain.id)) {
      this.changedSubdomain.next(subdomain);
      this.isKBNotShared = false;
    } else {
      this.changedSubdomain.next(subdomain);
      this.isKBNotShared = true;
    }
  };

  ngOnDestroy() {
    this.changedSubdomain.unsubscribe();
    this._userSubdomainsSub.unsubscribe();
    this._userPermitionsSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
  }

  checkItem(item: IControlAccessList, type: 'category' | 'subcategory' | 'faq') {
    item.checked = !item.checked;
    switch (type) {
      case 'category':
        this.categories
          .filter(c => c.parent_id === item.id)
          .forEach(c => {
            c.checked = item.checked;
            this.faqs
              .filter(f => f.parent_id === c.id)
              .forEach(f => {
                f.checked = item.checked
              })
          });

        this.faqs
          .filter(f => f.parent_id === item.id)
          .forEach(f => {
            f.checked = item.checked
          });
        break;
      case 'subcategory':
        this.faqs
          .filter(f => f.parent_id === item.id)
          .forEach(f => {
            f.checked = item.checked
          });
        this.categories.find(c => c.id === item.parent_id).checked = true;
        break;
      case 'faq':
        let parent;
        if (item.parent_id !== '1') {
          parent = this.categories.find(c => c.id === item.parent_id);
          parent.checked = true;
          if (parent.parent_id !== '1') {
            this.categories.find(c => c.id === parent.parent_id).checked = true;
          }
        }
        break;
    }
  };

  checkAll(lang) {
    let checked = this.isCheckAll('check', lang);
    this.categories
      .forEach(c => {
        if (c.lang === lang) {
          c.checked = checked
        }
      });
    this.faqs
      .forEach(f => {
        if (f.lang === lang) {
          f.checked = checked
        }
      });
  }

  isCheckAll(type, lang) {
    let checked = this.categories.filter(c => c.lang === lang && c.checked).length + this.faqs.filter(f => f.lang === lang && f.checked).length;
    let all = this.categories.length + this.faqs.length;
    if (type === 'check') {
      return checked === 0;
    } else {
      return all !== checked && checked !== 0;
    }
  };

  // TODO: rewrite to pipe
  isIndeterminate(item: IControlAccessList) {
    let isAllChecked = true;

    this.categories
      .filter(c => c.parent_id === item.id)
      .forEach(c => {
        if (!c.checked) {
          isAllChecked = false;
        }
      });

    this.faqs
      .filter(f => f.parents.indexOf(item.id) !== -1)
      .forEach(c => {
        if (!c.checked) {
          isAllChecked = false;
        }
      });
    return item.checked && !isAllChecked;
  };

  checkResource(lang) {
    let count = this.categories.filter(c => c.lang === lang).length + this.faqs.filter(f => f.lang === lang).length;
    if (count > 0) {
      return true;
    }
    return false;
  }

  submit() {
    this.user.permitted_resources = {
      categories: this.categories.filter(c => c.checked).map(c => c.id),
      faq: this.faqs.filter(f => f.checked).map(f => f.id)
    };

    this.$Users.update(this.user, this.changedSubdomain.getValue().subdomain)
      .then(res => {
        this.$Toast.success('MESSAGES.CONTROL_ACCESS_CHANGED');
        this.$Users.getAll();
        this.$Tree.rebuildTree();
        this.$Modal.close();
      })
      .catch(err => {
        this.$Toast.showServerErrors(err);
      })
  };
}
