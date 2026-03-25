import { Injectable } from '@angular/core';
import type { Document } from '../models/document.interface';
import type { DocumentApi } from './document-api.token';

const MOCK_DOCUMENT: Document = {
  name: 'test doc',
  pages: [
    { number: 1, imageUrl: 'assets/mock-pages/1.png', annotations: [] },
    { number: 2, imageUrl: 'assets/mock-pages/2.png', annotations: [] },
    { number: 3, imageUrl: 'assets/mock-pages/3.png', annotations: [] },
    { number: 4, imageUrl: 'assets/mock-pages/4.png', annotations: [] },
    { number: 5, imageUrl: 'assets/mock-pages/5.png', annotations: [] },
  ],
};

@Injectable()
export class DocumentMockApi implements DocumentApi {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocumentById(_id: string): Document {
    return structuredClone(MOCK_DOCUMENT);
  }
}
