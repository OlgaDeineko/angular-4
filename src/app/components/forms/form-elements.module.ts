import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { PipesModule } from '../../pipes/pipes.module';
import { OthersModule } from '../others/others.module';

import { FormCheckboxGroupComponent } from './form-checkbox-group/form-checkbox-group.component';
import { FormSelectComponent } from './form-select/form-select.component';
import { FormInputComponent } from './form-input/form-input.component';
import { FormColorPickerComponent } from './form-color-picker/form-color-picker.component';
import { FormSwitchComponent } from './form-switch/form-switch.component';
import { FormSingleImageComponent } from './form-single-image/form-single-image.component';
import {FormMultiLangComponent} from './form-multi-lang/form-multi-lang.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DirectivesModule} from '../../directives/directives.module';


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    OthersModule,
    ColorPickerModule,
    NgbModule.forRoot(),
    DirectivesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
  ],
  declarations: [
    FormCheckboxGroupComponent,
    FormInputComponent,
    FormSelectComponent,
    FormColorPickerComponent,
    FormSwitchComponent,
    FormSingleImageComponent,
    FormMultiLangComponent,
  ],
  exports: [
    FormCheckboxGroupComponent,
    FormInputComponent,
    FormSelectComponent,
    FormColorPickerComponent,
    FormSwitchComponent,
    FormSingleImageComponent,
    FormMultiLangComponent,
  ]
})
export class FormElementsModule {
}
