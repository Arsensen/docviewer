import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DOCUMENT_API } from './core/data-access/document-api.token';
import { DocumentHttpApi } from './core/data-access/document-api.service';
import { DocumentMockApi } from './core/data-access/document-api.mock.service';

import { routes } from './app.routes';

const useMockDocumentApi: boolean = true as const; //TODO: pass through env variable

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: DOCUMENT_API,
      useClass: useMockDocumentApi ? DocumentMockApi : DocumentHttpApi,
    },
  ],
};
