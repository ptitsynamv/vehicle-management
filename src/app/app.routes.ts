import { Routes } from '@angular/router';
import { ListComponent } from './components/list/list';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found';
import { DetailsComponent } from './components/details/details';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'vehicle/:id', component: DetailsComponent },
  { path: '**', component: PageNotFoundComponent },
];
