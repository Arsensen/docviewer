import { Injectable } from '@angular/core';
import type { Document } from '../models/document.interface';
import type { DocumentApi } from './document-api.token';

@Injectable()
export class DocumentHttpApi implements DocumentApi {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocumentById(_id: string): Document {
    throw new Error('DocumentHttpApi is not implemented yet');
  }
}
