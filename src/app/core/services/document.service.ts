import { inject, Injectable } from '@angular/core';
import { DOCUMENT_API } from '../api/document-api.token';
import type { IDocument } from '../models/document.interface';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly documentApi = inject(DOCUMENT_API);

  /**
   * Retrieves a document by its ID.
   *
   * @param {string} id The ID of the document to retrieve.
   * @returns {IDocument} The document with the specified ID.
   */
  public getDocument(id: string): IDocument {
    return this.documentApi.getDocumentById(id);
  }

  /**
   * Saves the specified document.
   *
   * @param {IDocument} document The document to save.
   */
  public saveDocument(document: IDocument): void {
    this.documentApi.saveDocument(document);
  }
}
