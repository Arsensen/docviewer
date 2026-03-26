import type { Routes } from '@angular/router';
import { DocViewerComponent } from './features/doc-viewer/doc-viewer.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  { path: 'document/:id', component: DocViewerComponent },
  { path: '', redirectTo: '/document/1', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
