import { Routes } from '@angular/router';
import { List } from './components/list/list';
import { PageNotFound } from './core/components/page-not-found/page-not-found';
import { Details } from './components/details/details';

export const routes: Routes = [
  { path: '', component: List },
  { path: 'vehicle/:id', component: Details },
  { path: '**', component: PageNotFound },
];
