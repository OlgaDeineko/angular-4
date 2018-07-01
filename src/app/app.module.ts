// angular
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// third-party components
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { ColorPickerModule } from 'ngx-color-picker';
import { TagInputModule } from 'ngx-chips';
import {FocusModule} from 'angular2-focus';
import {SelectModule} from 'angular2-select';

// general
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// page components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccessibilityComponent } from './pages/accessibility/accessibility.component';
import { ActivationUserComponent } from './pages/activation-user/activation-user.component';
import { AppearanceComponent } from './pages/appearance/appearance.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChooseLanguageComponent } from './pages/choose-language/choose-language.component';
import { EditFaqComponent } from './pages/edit-faq/edit-faq.component';
import { CreateFaqComponent } from './pages/create-faq/create-faq.component';
import { FaqComponent } from './pages/faq/faq.component';
import { FaqStatusComponent } from './pages/faq-status/faq-status.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { Page404Component } from './pages/page404/page404.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { VisitorComponent } from './pages/visitor/visitor.component';
import { VisitorFaqComponent } from './pages/visitor-faq/visitor-faq.component';
import { RedirectingComponent } from './pages/redirecting/redirecting.component';
import { ChooseSubdomainForSuperadminComponent } from './pages/choose-subdomain-for-superadmin/choose-subdomain-for-superadmin.component';
import { SubscriptionPlansComponent } from './pages/subscription-plans/subscription-plans.component';
import { ImportDataComponent } from './pages/import-data/import-data.component';
import { HelpWidgetComponent } from './pages/help-widget/help-widget.component';
import { AdvancedSettingsComponent } from './pages/advanced-settings/advanced-settings.component';
import { MultipleLanguagesComponent } from './pages/multiple-languages/multiple-languages.component';
import { UntranslatedComponent } from './pages/untranslated/untranslated.component';

// common modules
import { OthersModule } from './components/others/others.module';
import { KbModule } from './components/knowledge-base/kb.module';
import { FormElementsModule } from './components/forms/form-elements.module';

// modal windows
import { ForgotPasswordComponent } from './modals/forgot-password/forgot-password.component';
import { CreateUserComponent } from './modals/create-user/create-user.component';
import { EditUserComponent } from './modals/edit-user/edit-user.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { ChooseSubdomainModalComponent } from './modals/choose-subdomain-modal/choose-subdomain-modal.component';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { CreateCategoryComponent } from './modals/create-category/create-category.component';
import { EditCategoryComponent } from './modals/edit-category/edit-category.component';
import { ControlAccessComponent } from './modals/control-access/control-access.component';
import { ControlAccessGroupComponent } from './modals/control-access-group/control-access-group.component';
import { CreateKnowledgeBaseComponent } from './modals/create-knowledge-base/create-knowledge-base.component';
import { ImportCsvModalComponent } from './modals/import-csv-modal/import-csv-modal.component';
import { ActivateUserModalComponent } from './modals/activate-user-modal/activate-user-modal.component';
import { ConfirmPasswordModalComponent } from './modals/confirm-password-modal/confirm-password-modal.component';
import { CreateCategoryTranslationComponent } from './modals/create-category-translation/create-category-translation.component';
import { CreateGroupComponent } from './modals/create-group/create-group.component';
import { EditGroupComponent } from './modals/edit-group/edit-group.component';

// services
import { AlgoliaService } from './services/algolia.service';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { FaqService } from './services/faq.service';
import { FileService } from './services/file.service';
import { SessionService } from './services/session.service';
import { SettingService } from './services/setting.service';
import { ToastService } from './services/toast.service';
import { UsersService } from './services/users.service';
import { UrlService } from './services/url.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { GeneralService } from './services/general.service';
import { AdminResolverService } from './services/admin-resolver.service';
import { TreeService } from './services/tree.service';
import { TreeTranslateService } from './services/tree-translate.service';
import {TreeUntranslateService} from './services/tree-untranslate.service';
import { HttpHandlerService } from './services/http-handler.service';

// pipes
import { PipesModule } from './pipes/pipes.module';

// directives
import { DirectivesModule } from './directives/directives.module';

import { createHttpInterceptor, createTranslateLoader } from './libs/appFactories';





@NgModule({
  declarations: [
    AppComponent,

    // page components
    DashboardComponent,
    AccessibilityComponent,
    ActivationUserComponent,
    AppearanceComponent,
    ChangePasswordComponent,
    ChooseLanguageComponent,
    EditFaqComponent,
    CreateFaqComponent,
    FaqComponent,
    FaqStatusComponent,
    ResetPasswordComponent,
    LoginComponent,
    Page404Component,
    PersonalInfoComponent,
    SettingsComponent,
    UsersComponent,
    VisitorComponent,
    VisitorFaqComponent,
    RedirectingComponent,
    ChooseSubdomainForSuperadminComponent,
    SubscriptionPlansComponent,
    ImportDataComponent,
    HelpWidgetComponent,
    AdvancedSettingsComponent,
    // modals
    ForgotPasswordComponent,
    CreateUserComponent,
    EditUserComponent,
    ConfirmModalComponent,
    ChooseSubdomainModalComponent,
    LoginModalComponent,
    CreateCategoryComponent,
    EditCategoryComponent,
    ControlAccessComponent,
    CreateKnowledgeBaseComponent,
    ActivateUserModalComponent,
    ImportCsvModalComponent,
    ConfirmPasswordModalComponent,
    MultipleLanguagesComponent,
    CreateCategoryTranslationComponent,
    UntranslatedComponent,
    CreateGroupComponent,
    EditGroupComponent,
    ControlAccessGroupComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FocusModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    ToasterModule,
    NgbModule.forRoot(),
    ColorPickerModule,
    TagInputModule,
    OthersModule,
    KbModule,
    FormElementsModule,
    DirectivesModule,
    PipesModule,
    SelectModule,
  ],
  providers: [
    AlgoliaService,
    AuthService,
    CategoryService,
    FaqService,
    FileService,
    SessionService,
    SettingService,
    ToastService,
    UsersService,
    UrlService,
    HttpInterceptorService,
    GeneralService,
    AdminResolverService,
    TreeService,
    HttpHandlerService,
    TreeTranslateService,
    TreeUntranslateService,

    Title,

    {
      provide: Http,
      useFactory: createHttpInterceptor,
      deps: [XHRBackend, RequestOptions, HttpHandlerService]
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ForgotPasswordComponent,
    CreateUserComponent,
    EditUserComponent,
    ConfirmModalComponent,
    ChooseSubdomainModalComponent,
    LoginModalComponent,
    CreateCategoryComponent,
    EditCategoryComponent,
    ControlAccessComponent,
    ControlAccessGroupComponent,
    CreateKnowledgeBaseComponent,
    ActivateUserModalComponent,
    ImportCsvModalComponent,
    ConfirmPasswordModalComponent,
    CreateCategoryTranslationComponent,
    CreateGroupComponent,
    EditGroupComponent,

  ]
})
export class AppModule {
}
