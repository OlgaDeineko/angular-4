import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// third-party components
import { ToasterModule } from 'angular2-toaster';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// general
import { RegistrationAppComponent } from './registration-app.component';
import { RegistrationRoutingModule } from './registration-routing.module';

// page components
import { RegistrationStep1Component } from './pages/registration-step-1/registration-step-1.component';
import { RegistrationStep2Component } from './pages/registration-step-2/registration-step-2.component';
import { RegistrationStep3Component } from './pages/registration-step-3/registration-step-3.component';
import { RegistrationStep4Component } from './pages/registration-step-4/registration-step-4.component';

// modules
import { FormElementsModule } from '../../components/forms/form-elements.module';
import { PipesModule } from '../../pipes/pipes.module';
import { OthersModule } from '../../components/others/others.module';

// services
import { ToastService } from '../../services/toast.service';
import { RegistrationService } from './services/registration.service';
import { UrlService } from '../../services/url.service';
import { SessionService } from '../../services/session.service';
import { HttpInterceptorService } from '../../services/http-interceptor.service';
import { HttpHandlerService } from '../../services/http-handler.service';

import { createHttpInterceptor, createTranslateLoader } from '../../libs/appFactories';


@NgModule({
  declarations: [
    RegistrationAppComponent,

    RegistrationStep1Component,

    RegistrationStep2Component,

    RegistrationStep3Component,

    RegistrationStep4Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RegistrationRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),

    FormElementsModule,
    PipesModule,
    OthersModule,
  ],
  providers: [
    ToastService,
    RegistrationService,
    UrlService,
    SessionService,
    HttpInterceptorService,
    HttpHandlerService,

    {
      provide: Http,
      useFactory: createHttpInterceptor,
      deps: [XHRBackend, RequestOptions, HttpHandlerService]
    }
  ],
  bootstrap: [RegistrationAppComponent]
})
export class RegistrationModule {
}
