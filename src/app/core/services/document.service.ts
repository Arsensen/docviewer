import { inject, Injectable } from '@angular/core';
import { DOCUMENT_API } from '../api/document-api.token';
import type { IDocument } from '../models/document.interface';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly documentApi = inject(DOCUMENT_API);

  public getDocument(id: string): IDocument {
    return this.documentApi.getDocumentById(id);
  }

  public saveDocument(document: IDocument): void {
    this.documentApi.saveDocument(document);
  }
}
