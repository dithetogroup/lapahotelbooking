// regular-clients.routes.ts
import { Routes } from '@angular/router';
import { SpaBookingsComponent } from './booking-list/spa-bookings.component';
import { TherapistsListComponent } from '../therapists-list/therapists-list.component';

export const SPA_ROUTE: Routes = [
  {
    path: '',
    redirectTo: 'spa-bookings',
    pathMatch: 'full',
  },
  {
    path: 'spa-bookings',
    component: SpaBookingsComponent
  },
  {
    path: 'spa-therapists',
    component: TherapistsListComponent
  },

];
