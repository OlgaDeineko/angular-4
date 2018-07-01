import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ng2-clipboard';

import { createTranslateLoader } from '../../libs/appFactories';

import { PipesModule } from '../../pipes/pipes.module';
import { OthersModule } from '../others/others.module';
import { DirectivesModule } from '../../directives/directives.module';

import { AlgoliaSearchComponent } from './algolia-search/algolia-search.component';
import { KbTemplate0Component } from './kb-template-0/kb-template-0.component';
import { KbTemplate1Component } from './kb-template-1/kb-template-1.component';
import { KbFaqTemplate0Component } from './kb-faq-template-0/kb-faq-template-0.component';
import { KbFaqTemplate1Component } from './kb-faq-template-1/kb-faq-template-1.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FocusModule} from 'angular2-focus';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    NgbModule.forRoot(),
    FocusModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),

    OthersModule,
    PipesModule,
    DirectivesModule,
  ],
  declarations: [
    AlgoliaSearchComponent,
    KbTemplate0Component,
    KbTemplate1Component,
    KbFaqTemplate0Component,
    KbFaqTemplate1Component,
  ],
  exports: [
    AlgoliaSearchComponent,
    KbTemplate0Component,
    KbTemplate1Component,
    KbFaqTemplate0Component,
    KbFaqTemplate1Component,
  ]
})
export class KbModule {
}
