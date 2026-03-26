import { TestBed } from '@angular/core/testing';
import { DocumentService } from './document.service';
import { DOCUMENT_API } from '../data-access/document-api.token';
import { MOCK_DOCUMENT } from '../../testing/mock-data';
import type { DocumentApi } from '../data-access/document-api.token';
import type { IDocument } from '../models/document.interface';

describe('DocumentService', () => {
  let service: DocumentService;
  let mockApi: DocumentApi;

  beforeEach(() => {
    mockApi = {
      getDocumentById: vi.fn().mockReturnValue(MOCK_DOCUMENT),
      saveDocument: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [DocumentService, { provide: DOCUMENT_API, useValue: mockApi }],
    });

    service = TestBed.inject(DocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDocument', () => {
    it('should delegate to documentApi.getDocumentById', () => {
      const result: IDocument = service.getDocument('123');

      expect(mockApi.getDocumentById).toHaveBeenCalledWith('123');
      expect(result).toBe(MOCK_DOCUMENT);
    });
  });

  describe('saveDocument', () => {
    it('should delegate to documentApi.saveDocument', () => {
      service.saveDocument(MOCK_DOCUMENT);

      expect(mockApi.saveDocument).toHaveBeenCalledWith(MOCK_DOCUMENT);
    });
  });
});
