import { InjectionToken } from '@angular/core';
import type { IDocument } from '../models/document.interface';

export interface DocumentApi {
  getDocumentById(id: string): IDocument;
  saveDocument(document: IDocument): void;
}

export const DOCUMENT_API: InjectionToken<DocumentApi> = new InjectionToken<DocumentApi>(
  'DOCUMENT_API',
);
