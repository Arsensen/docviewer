import { Injectable } from '@angular/core';
import type { IDocument } from '../models/document.interface';
import type { DocumentApi } from './document-api.token';

const MOCK_DOCUMENT: IDocument = {
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
  /**
   * Retrieves a document by its ID. In this mock implementation, it returns a cloned version of a predefined mock document.
   * Let's assume that we get some resource signal.
   *
   * @param {string} _id The ID of the document to retrieve (not used in this mock).
   * @returns {IDocument} A cloned instance of the mock document.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getDocumentById(_id: string): IDocument {
    return structuredClone(MOCK_DOCUMENT);
  }

  /**
   * Saves the provided document. In this mock implementation, it logs the document to the console.
   *
   * @param {IDocument} document The document to save.
   */
  public saveDocument(document: IDocument): void {
    /* eslint-disable no-console */
    console.log(
      '%c📄 Document saved: %c%s',
      'color: #4CAF50; font-weight: bold',
      'color: #1976d2; font-weight: bold',
      document.name,
    );

    for (const page of document.pages) {
      console.log(
        '%cPage %d %c— %d annotation(s)',
        'font-weight: bold',
        page.number,
        'color: gray',
        page.annotations.length,
      );
      if (page.annotations.length > 0) {
        console.table(
          page.annotations.map((a) => ({
            id: a.id,
            x: `${a.x.toFixed(1)}%`,
            y: `${a.y.toFixed(1)}%`,
            text: a.text,
          })),
        );
      }
    }

    console.log('Raw document object:', document);
    /* eslint-enable no-console */
  }
}
