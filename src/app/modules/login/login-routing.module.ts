import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChooseSubdomainComponent } from './pages/choose-subdomain/choose-subdomain.component';

import { NotExistSubdomainGuard } from '../../guards/not-exist-subdomain.guard';


export let loginRoutes: Routes = [
  {
    path: '',
    component: ChooseSubdomainComponent,
    canActivate: [NotExistSubdomainGuard],
    data: {
      name: 'subdomain'
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(loginRoutes)],
  exports: [RouterModule],
  providers: [
    NotExistSubdomainGuard
  ]
})
export class LoginRoutingModule {
}
