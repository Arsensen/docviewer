import { Injectable } from '@angular/core';
import type { IDocument } from '../models/document.interface';
import type { DocumentApi } from './document-api.token';

@Injectable()
export class DocumentHttpApi implements DocumentApi {
  /**
   * Retrieves a document by its ID. In this implementation, it throws an error indicating that the method is not yet implemented.
   * Let's assume that we get some resource signal.
   *
   * @param {string} _id The ID of the document to retrieve (not used in this implementation).
   * @returns {IDocument} This method does not return a document; it throws an error instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getDocumentById(_id: string): IDocument {
    throw new Error('DocumentHttpApi is not implemented yet');
  }

  /**
   * Saves the provided document. In this implementation, it throws an error indicating that the method is not yet implemented.
   *
   * @param {IDocument} _document The document to save (not used in this implementation).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public saveDocument(_document: IDocument): void {
    throw new Error('DocumentHttpApi is not implemented yet');
  }
}
