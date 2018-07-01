import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqService } from '../../../services/faq.service';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { ICategory } from '../../../interfaces/i-category';
import { IFaq } from '../../../interfaces/i-faq';
import { CategoryService } from '../../../services/category.service';
import {SessionService} from '../../../services/session.service';

@Component({
  selector: 'ma-faq-statuses-sidebar',
  templateUrl: './faq-statuses-sidebar.component.html',
  styleUrls: ['./faq-statuses-sidebar.component.scss']
})
export class FaqStatusesSidebarComponent implements OnInit, OnDestroy {
  untranslatedCounter: number;
  untranslatedFaq: IFaq[];
  untranslatedCat: ICategory[];
  faqCounts: any;

  private _untranslatedFAQ: AnonymousSubscription;
  private _untranslatedCategories: AnonymousSubscription;
  private _faqSub: AnonymousSubscription;
  private _faqTSub: AnonymousSubscription;

  constructor(public $Faq: FaqService, private $Category: CategoryService, private $Session: SessionService) {
    this.$Faq.getFaqTrash();
    this.$Faq.getUntranslatedFaq();
    this.$Category.getUntranslatedCategories();
    if (this.$Faq.faqs.getValue() === null) {
      this.$Faq.getAll(this.$Session.systemLang.data.code);
    }
  }

  ngOnInit() {
    this._faqTSub = this.$Faq.faqsTrash
      .subscribe((result) => {
        if (result) {
          this._faqSub = this.$Faq.faqs
            .subscribe((res) => {
              if (res) {
                this.$Faq.countsTypes(result, res);
                this.faqCounts = this.$Faq.counts.getValue();
              }
            })
        }
      });
    this._untranslatedCategories = this.$Category.categoriesUntranslated
      .subscribe((result) => {
        this.untranslatedCat = result;
        this._untranslatedFAQ = this.$Faq.faqsUntranslated
          .subscribe((res) => {
            this.untranslatedFaq = res;
            let faqArray = [];
            if (this.untranslatedFaq && this.untranslatedCat) {
              this.untranslatedFaq.forEach((faq) => {
                if (faq.status !== 'trash') {
                  faqArray.push(faq)
                }
              });
              this.untranslatedCounter = faqArray.length + (this.untranslatedCat.length - 1);
            }
          })
      })
  }

  ngOnDestroy() {
    this._untranslatedFAQ.unsubscribe();
    this._untranslatedCategories.unsubscribe();
    this._faqSub.unsubscribe();
    this._faqTSub.unsubscribe();
  }
}
