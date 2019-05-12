import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ErrorComponent } from './components/error/error.component';

const APP_ROUTES: Routes = [
  { path: '', component: CalendarComponent },
  { path: 'error', component: ErrorComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
