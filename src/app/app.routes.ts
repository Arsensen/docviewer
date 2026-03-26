import type { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ViewerPageComponent } from '@pages/viewer-page/viewer-page.component';

export const routes: Routes = [
  { path: 'document/:id', component: ViewerPageComponent },
  { path: '', redirectTo: '/document/1', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
