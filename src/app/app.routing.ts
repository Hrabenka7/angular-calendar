import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';

const APP_ROUTES: Routes = [
  { path: '', component: CalendarComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
