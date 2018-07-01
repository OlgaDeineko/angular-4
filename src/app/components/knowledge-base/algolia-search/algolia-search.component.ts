import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AlgoliaResponse } from 'algoliasearch';

import { Algolia } from '../../../classes/algolia';

import { FaqService } from '../../../services/faq.service';
import { ToastService } from '../../../services/toast.service';
import { SettingService } from '../../../services/setting.service';
import { AlgoliaService } from '../../../services/algolia.service';
import { ILang } from '../../../interfaces/i-lang';
import { UrlService } from '../../../services/url.service';

@Component({
  selector: 'ma-algolia-search',
  templateUrl: './algolia-search.component.html',
  styleUrls: ['./algolia-search.component.scss']
})
export class AlgoliaSearchComponent implements OnChanges, OnDestroy {

  @Input('searchModel') searchModel: string;
  @Input('category') category: string;

  algoliaResults: any[] = [];
  searching: Algolia;
  multiLanguage: boolean;

  private _sharedFAQSub: AnonymousSubscription;
  private _visitorLangSub: AnonymousSubscription;
  private _multilanguageSub: AnonymousSubscription;

  constructor(private $Faq: FaqService,
              private $Router: Router,
              private $Setting: SettingService,
              private $Algolia: AlgoliaService,
              private $Url: UrlService,
              private $Toast: ToastService) {
    this.searching = this.$Algolia.initSearching((content: AlgoliaResponse) => {
      this.algoliaResults = content.hits.map((hit) => {
        hit._highlightResult.answer.value = String(hit._highlightResult.answer.value).replace(/<(?!\/?em)[^>]+>/gm, '');
        return hit
      });
    });

    this._multilanguageSub = this.$Setting.checkMultiLanguage.subscribe((res) => {
      this.multiLanguage = res;
    });

    this._visitorLangSub = this.$Setting.visitorLanguage
      .subscribe((languag) => {
        let code = languag.code;
        if (this.multiLanguage !== false) {
          this.searching.language = code;
        }
      });

    this._sharedFAQSub = this.$Setting.sharedFAQ
      .subscribe((sharedFAQ) => {
        this.searching.visibleArticles = sharedFAQ;
      });
  }

  ngOnDestroy() {
    this._sharedFAQSub.unsubscribe();
    this._visitorLangSub.unsubscribe();
    this._multilanguageSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.searchModel) {
      return;
    }
    this.searching.hierarchicalCategory = this.category;
    this.searching.search(this.searchModel);
  }

  goToFaq(id) {
    this.$Faq.getById(id, true)
      .then((faq) => {
        this.$Router.navigate(this.$Faq.getLink(faq, 'visitor'))
      })
      .catch((error) => {
        this.$Toast.showServerErrors(error);
      });
  }
}
