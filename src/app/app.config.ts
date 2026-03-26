import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DOCUMENT_API } from './core/api/document-api.token';
import { DocumentHttpApi } from './core/api/document-api.service';
import { DocumentMockApi } from './core/api/document-api.mock.service';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: DOCUMENT_API,
      useClass: environment.useMockDocumentApi ? DocumentMockApi : DocumentHttpApi,
    },
  ],
};
