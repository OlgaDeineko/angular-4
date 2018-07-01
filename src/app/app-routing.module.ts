import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccessibilityComponent } from './pages/accessibility/accessibility.component';
import { ActivationUserComponent } from './pages/activation-user/activation-user.component';
import { AppearanceComponent } from './pages/appearance/appearance.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChooseLanguageComponent } from './pages/choose-language/choose-language.component';
import { EditFaqComponent } from './pages/edit-faq/edit-faq.component';
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

import { matchCategory, matchFaq } from './libs/urlMatcher';
import { AdminResolverService } from './services/admin-resolver.service';

import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthorizedGuard } from './guards/authorized.guard';
import { RoleAccessesGuard } from './guards/role-accesses.guard';
import { AccessibilityGuard } from './guards/accessibility.guard';
import { MultipleLanguagesComponent } from './pages/multiple-languages/multiple-languages.component';
import {CreateFaqComponent} from './pages/create-faq/create-faq.component';
import {UntranslatedComponent} from './pages/untranslated/untranslated.component';

export let routes: Routes = [
  {
    path: '404',
    component: Page404Component,
    data: {
      name: '404Page'
    }
  },
  {
    path: 'redirecting',
    component: RedirectingComponent,
    data: {
      name: 'redirecting'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      name: 'login'
    }
  },
  {
    path: 'activate',
    component: ActivationUserComponent,
    data: {
      name: 'activate'
    }
  },
  {
    path: 'requestPasswordReset',
    component: ResetPasswordComponent,
    data: {
      name: 'requestPasswordReset'
    }
  },
  {
    path: 'admin',
    resolve: {
      commonSetting: AdminResolverService,
    },
    children: [
      {
        path: 'editFAQ/:faqSlug',
        component: EditFaqComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'editFAQ',
          permissions: {
            roles: ['editor', 'admin', 'contributor'],
            redirectTo: '/admin'
          }
        }
      },
      {
        path: 'createFAQ',
        component: CreateFaqComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'createFAQ',
          permissions: {
            roles: ['editor', 'admin', 'contributor'],
            redirectTo: '/admin'
          }
        }
      },
      {
        path: 'faq/:status',
        component: FaqStatusComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'faqStatuses',
          permissions: {
            roles: ['editor', 'admin', 'contributor'],
            redirectTo: '/admin'
          }
        }
      },
      {
        path: 'untranslated',
        children: [
          {
            matcher: matchFaq,
            component: FaqComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'viewFaq',
              permissions: {
                roles: ['editor', 'admin', 'contributor'],
                redirectTo: '/admin'
              }
            }
          },
          {
            matcher: matchCategory,
            component: UntranslatedComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'untranslated',
              permissions: {
                roles: ['editor', 'admin', 'contributor'],
                redirectTo: '/admin'
              }
            }
          },
        ]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'users',
          permissions: {
            roles: ['admin'],
            redirectTo: '/admin'
          }
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'settings',
          permissions: {
            roles: ['editor', 'admin', 'contributor'],
            redirectTo: '/admin'
          }
        },
        children: [
          {
            path: 'personalInfo',
            component: PersonalInfoComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'personalInfo',
              permissions: {
                roles: ['editor', 'admin', 'contributor'],
                redirectTo: '/admin'
              }
            }
          },
          {
            path: 'chooseLanguage',
            component: ChooseLanguageComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'chooseLanguage',
              permissions: {
                roles: ['editor', 'admin', 'contributor'],
                redirectTo: '/admin'
              }
            }
          },
          {
            path: 'changePassword',
            component: ChangePasswordComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'changePassword',
              permissions: {
                roles: ['editor', 'admin', 'contributor'],
                redirectTo: '/admin'
              }
            }
          },
          {
            path: 'appearance',
            component: AppearanceComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'appearance',
              permissions: {
                roles: ['admin'],
                redirectTo: '/admin'
              }
            }
          },
          {
            path: 'accessibility',
            component: AccessibilityComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'accessibility',
              permissions: {
                roles: ['admin'],
                redirectTo: '/admin'
              }
            }
          },
          {
            path: 'importData',
            component: ImportDataComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'importData',
              permissions: {
                roles: ['admin'],
                redirectTo: '/admin'
              }
            }
          },
            {
                path: 'helpWidget',
                component: HelpWidgetComponent,
                canActivate: [AuthorizedGuard, RoleAccessesGuard],
                data: {
                    name: 'helpWidget',
                    permissions: {
                        roles: ['admin'],
                        redirectTo: '/admin'
                    }
                }
            },
          {
            path: 'advancedSettings',
            component: AdvancedSettingsComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'advancedSettings',
              permissions: {
                roles: ['admin'],
                redirectTo: '/admin'
              }
            }
          }, {
            path: 'multipleLanguages',
            component: MultipleLanguagesComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'multipleLanguages',
              permissions: {
                roles: ['admin'],
                redirectTo: '/admin'
              }
            }
          }
        ]
      },
      {
        path: 'choosesubdomain',
        component: ChooseSubdomainForSuperadminComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'choosesubdomain',
          permissions: {
            roles: ['superAdmin'],
            redirectTo: '/admin'
          }
        },
        children: [
          {
            path: 'subscriptionPlans/:code',
            component: SubscriptionPlansComponent,
            canActivate: [AuthorizedGuard, RoleAccessesGuard],
            data: {
              name: 'subscriptionPlans',
              permissions: {
                roles: ['superAdmin'],
                redirectTo: '/admin'
              }
            }
          }]
      },
      {
        matcher: matchFaq,
        component: FaqComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'viewFaq',
          permissions: {
            roles: ['editor', 'admin', 'contributor'],
            redirectTo: '/admin'
          }
        }
      },
      {
        matcher: matchCategory,
        component: DashboardComponent,
        canActivate: [AuthorizedGuard, RoleAccessesGuard],
        data: {
          name: 'dashboard',
          permissions: {
            roles: ['editor', 'admin', 'contributor'],
            redirectTo: '/login'
          }
        }
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/404'
      }
    ]
  },
  {
    matcher: matchFaq,
    component: VisitorFaqComponent,
    canActivate: [AccessibilityGuard],
    data: {
      name: 'KBFaq'
    }
  },
  {
    matcher: matchCategory,
    component: VisitorComponent,
    canActivate: [AccessibilityGuard],
    data: {
      name: 'KB'
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AnonymousGuard,
    AuthorizedGuard,
    RoleAccessesGuard,
    AccessibilityGuard
  ]
})
export class AppRoutingModule {
}
