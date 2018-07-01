import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// third-party components
import { DndModule } from 'ng2-dnd';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

// components
import { MyKbListComponent } from './my-kb-list/my-kb-list.component';
import { TreeItemComponent } from './tree-item/tree-item.component';
import { TreeComponent } from './tree/tree.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CheckUsersComponent } from './check-users/check-users.component';
import { TinyMceComponent } from './tiny-mce/tiny-mce.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FaqStatusesSidebarComponent } from './faq-statuses-sidebar/faq-statuses-sidebar.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DirectivesModule,
    PipesModule,
    NgbModule.forRoot(),
    DndModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
  ],
  declarations: [
    SidebarMenuComponent,
    UploadFileComponent,
    FaqStatusesSidebarComponent,
    BreadcrumbsComponent,
    TinyMceComponent,
    CheckUsersComponent,
    SpinnerComponent,
    TreeComponent,
    TreeItemComponent,
    MyKbListComponent,
  ],
  exports: [
    SidebarMenuComponent,
    UploadFileComponent,
    FaqStatusesSidebarComponent,
    BreadcrumbsComponent,
    TinyMceComponent,
    CheckUsersComponent,
    SpinnerComponent,
    TreeComponent,
    TreeItemComponent,
    MyKbListComponent,
  ]
})
export class OthersModule {
}
