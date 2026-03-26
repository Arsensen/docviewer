import type { IAnnotation } from '@core/models/annotation.interface';
import type { IPage } from '@core/models/page.interface';
import type { IDocument } from '@core/models/document.interface';

export const MOCK_ANNOTATION: IAnnotation = {
  id: 'ann-1',
  pageNumber: 1,
  x: 10,
  y: 20,
  text: 'Test annotation',
  width: 200,
  height: 50,
};

export const MOCK_PAGE: IPage = {
  number: 1,
  imageUrl: 'test.png',
  annotations: [{ id: 'a1', pageNumber: 1, x: 10, y: 20, text: 'Test annotation' }],
};

export const MOCK_DOCUMENT: IDocument = {
  name: 'Test Document',
  pages: [
    { number: 1, imageUrl: 'page1.png', annotations: [] },
    {
      number: 2,
      imageUrl: 'page2.png',
      annotations: [{ id: 'ann-1', pageNumber: 2, x: 10, y: 20, text: 'Existing' }],
    },
  ],
};
