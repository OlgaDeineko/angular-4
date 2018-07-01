import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationStep4Component} from './pages/registration-step-4/registration-step-4.component';
import {RegistrationStep3Component} from './pages/registration-step-3/registration-step-3.component';
import {RegistrationStep2Component} from './pages/registration-step-2/registration-step-2.component';
import {RegistrationStep1Component} from './pages/registration-step-1/registration-step-1.component';

export let registrationRoutes: Routes = [
  {
    path: '',
    component: RegistrationStep1Component,
    data: {
      name: 'registration'
    },
  },
  {
    path: 'step2',
    component: RegistrationStep2Component,
    data: {
      name: 'step2',
    }
  },
  {
    path: 'step3',
    component: RegistrationStep3Component,
    data: {
      name: 'step3',
    }
  },
  {
    path: 'step4',
    component: RegistrationStep4Component,
    data: {
      name: 'step4',
    }
  },
  {
    path: ':lang',
    component: RegistrationStep1Component,
    data: {
      name: 'registration'
    },
  },
  {
    path: ':lang/step2',
    component: RegistrationStep2Component,
    data: {
      name: 'step2',
    }
  },
  {
    path: ':lang/step3',
    component: RegistrationStep3Component,
    data: {
      name: 'step3',
    }
  },
  {
    path: ':lang/step4',
    component: RegistrationStep4Component,
    data: {
      name: 'step4',
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(registrationRoutes)
  ],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {
}
