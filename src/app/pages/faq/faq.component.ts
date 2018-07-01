import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AnonymousSubscription} from 'rxjs/Subscription';

import {FaqService} from '../../services/faq.service';
import {CategoryService} from '../../services/category.service';
import {ToastService} from '../../services/toast.service';
import {SessionService} from '../../services/session.service';

import {IFaq} from '../../interfaces/i-faq';


@Component({
  selector: 'ma-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {

  faq: IFaq;
  disabled = false;

  private _routeSub: AnonymousSubscription;
  private _faqSub: AnonymousSubscription;
  private _categorySub: AnonymousSubscription;

  constructor(private $Faq: FaqService,
              private $Category: CategoryService,
              private $Toast: ToastService,
              private $Session: SessionService,
              private $Router: Router,
              private $Route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.$Session.previousPage.data === '/admin/untranslated') {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this._routeSub = this.$Route.paramMap
      .subscribe(res => {
        this._faqSub = this.$Faq.getBySlug(res.get('faqSlug'))
          .subscribe(faq => {
            this.faq = faq;
            this.faq.fullCategoryName = 'Home';

            switch (this.faq.category.type) {
              case 'subcategory':
                this.$Category.getById(this.faq.category.parent_id)
                  .subscribe(category => {
                    this.faq.fullCategoryName = `Home / ${category.name} / ${this.faq.category.name}`
                  })
                break;
              case 'category':
                this.faq.fullCategoryName = `Home / ${this.faq.category.name}`;
                break;
              case 'home':
                this.faq.fullCategoryName = `${this.faq.category.name}`;
                break;
            }

            if (this.faq.status === 'published') {
              this.$Session.kbRout.data = this.$Faq.getLink(this.faq, 'visitor');
            }
          }, err => {
            this.$Toast.showServerErrors(err);
            this.$Router.navigate(['/admin']);
          })
      })
  }

  ngOnDestroy() {
    this._routeSub.unsubscribe();
    this._faqSub.unsubscribe();
    if (this._categorySub) {
      this._categorySub.unsubscribe();
    }
  }
}
