import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT_API } from '../data-access/document-api.token';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly documentApi = inject(DOCUMENT_API);

  getDocument(id: string) {
    return signal(this.documentApi.getDocumentById(id));
  }
}
