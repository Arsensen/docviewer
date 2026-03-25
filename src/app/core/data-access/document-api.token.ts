import { InjectionToken } from '@angular/core';
import type { Document } from '../models/document.interface';

export interface DocumentApi {
  getDocumentById(id: string): Document;
}

export const DOCUMENT_API = new InjectionToken<DocumentApi>('DOCUMENT_API');
