import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnonymousSubscription } from 'rxjs/Subscription';

import { SettingService } from '../../services/setting.service';
import { FaqService } from '../../services/faq.service';
import { GeneralService } from '../../services/general.service';

import { IFaq } from '../../interfaces/i-faq';
import { IOrderList } from '../../interfaces/i-order-list';
import { ILang } from '../../interfaces/i-lang';

@Component({
  selector: 'ma-faq-status',
  templateUrl: './faq-status.component.html',
  styleUrls: ['./faq-status.component.scss']
})
export class FaqStatusComponent implements OnInit, OnDestroy {

  order: IOrderList;
  orderList: IOrderList[];
  title: string;
  faqStatus: string;
  searchModel: string;
  faqs: IFaq[] = [];
  languages: ILang[];
  transLang: ILang[];

  private _languagesSettingsSub: AnonymousSubscription;
  private _routeSub: AnonymousSubscription;
  private _commonSettingSub: AnonymousSubscription;
  private _faqSub: AnonymousSubscription;
  private _affFaqsSub: AnonymousSubscription;
  private _filterSub: AnonymousSubscription;

  constructor(private $Route: ActivatedRoute,
              private $Router: Router,
              private $Faq: FaqService,
              private $General: GeneralService,
              private $Setting: SettingService) {
  }

  ngOnInit() {
    this.orderList = this.$General.orderList;
    this._affFaqsSub = this.$Faq.faqs
      .subscribe(() => {
        this._routeSub = this.$Route.paramMap
          .subscribe(res => {
            this.faqStatus = res.get('status');
            this.title = 'FAQ.STATUSES_PAGE.' + this.faqStatus.toUpperCase();
            this.searchModel = '';
            if (this.faqStatus === 'trash') {
              this._faqSub = this.$Faq.faqsTrash
                .subscribe(re => {
                  this.faqs = re;
                });
            } else {
              this.$Faq.filterFaq('', this.faqStatus === 'all' ? '!trash' : this.faqStatus, null);
              this._faqSub = this.$Faq.filteredFaqs
                .subscribe(result => {
                  this.faqs = result;
                });
            }
          })
      });

    this._commonSettingSub = this.$Setting.commonSettings
      .subscribe(settings => {
        let validStatus = !!settings.faq_statuses.find(s => s.code === this.faqStatus);
        if (!validStatus && this.faqStatus !== 'all') {
          this.$Router.navigate(['/admin']);
          return
        }
      });

    this._filterSub = this.$Setting.filter
      .subscribe(res => {
        this.order = this.$General.orderList.find((o) => o.name === res.sort_by);
      });
    this._languagesSettingsSub = this.$Setting.getallowlanguages
      .subscribe((languages: ILang[]) => {
        if (languages.length > 0) {
          this.languages = languages;
          this.transLang = languages.filter((lang) => lang.code !== 'nl');
        } else {
          this.languages = [{name: 'Dutch', code: 'nl'}];
        }
      });
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
    this._commonSettingSub.unsubscribe();
    this._faqSub.unsubscribe();
    this._affFaqsSub.unsubscribe();
    this._filterSub.unsubscribe();
    this._languagesSettingsSub.unsubscribe();
  }

  changeOrder(item) {
    this.order = item;
    this.$Setting.changeCategoryOrder(item.name);
  }

  search() {
    this.$Faq.filterFaq(this.searchModel, this.faqStatus === 'all' ? '!trash' : this.faqStatus, null);
  }
}
