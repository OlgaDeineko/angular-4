import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// third-party components
import { ToasterModule } from 'angular2-toaster';

// general
import { LoginAppComponent } from './login-app.component';
import { LoginRoutingModule } from './login-routing.module';

// page components
import { ChooseSubdomainComponent } from './pages/choose-subdomain/choose-subdomain.component';

// modules
import { FormElementsModule } from '../../components/forms/form-elements.module';
import { PipesModule } from '../../pipes/pipes.module';

// services
import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';
import { UrlService } from '../../services/url.service';
import { SessionService } from '../../services/session.service';
import { FileService } from '../../services/file.service';
import { HttpInterceptorService } from '../../services/http-interceptor.service';
import { HttpHandlerService } from '../../services/http-handler.service';

import { createHttpInterceptor, createTranslateLoader } from '../../libs/appFactories';


@NgModule({
  declarations: [
    LoginAppComponent,

    ChooseSubdomainComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoginRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),

    FormElementsModule,
    PipesModule,
  ],
  providers: [
    ToastService,
    SettingService,
    UrlService,
    SessionService,
    FileService,
    HttpInterceptorService,
    HttpHandlerService,

    {
      provide: Http,
      useFactory: createHttpInterceptor,
      deps: [XHRBackend, RequestOptions, HttpHandlerService]
    }
  ],
  bootstrap: [LoginAppComponent]
})
export class LoginModule {
}
