import { Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { MyscheduleComponent } from './myschedule/myschedule.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: 'courses', component: CoursesComponent },
    { path: 'myschedule', component: MyscheduleComponent },
    { path: '', redirectTo: '/courses', pathMatch: 'full' },
    { path: '404', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }
];
