
import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { ClientsComponent } from './clients.component';

export const CLIENTS_ROUTE: Route[] = [
  {
    path: '',
    component: ClientsComponent,
  },
  { path: '**', component: Page404Component },
];
