import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { ToFormOptionsPipe } from './to-form-options.pipe';
import { CountFaqWordsPipe } from './count-faq-words.pipe';
import { FindPipe } from './find.pipe';
import { ConvertHtmlPipe } from './convert-html.pipe';
import { OrderByPipe } from './order-by.pipe';
import { IconClassPipe } from './icon-class.pipe';
import { FormValidationErrorsPipe } from './form-validation-errors.pipe';
import { BigListPipe } from './big-list.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormValidationErrorsPipe,
    IconClassPipe,
    OrderByPipe,
    ConvertHtmlPipe,
    FindPipe,
    CountFaqWordsPipe,
    ToFormOptionsPipe,
    FilterPipe,
    BigListPipe,
  ],
  exports: [
    FormValidationErrorsPipe,
    IconClassPipe,
    OrderByPipe,
    ConvertHtmlPipe,
    FindPipe,
    CountFaqWordsPipe,
    ToFormOptionsPipe,
    FilterPipe,
    BigListPipe,
  ]
})
export class PipesModule {
}
