import type { Annotation } from './annotation.interface';

export interface Page {
  number: number;
  imageUrl: string;
  annotations: Array<Annotation>;
}

export interface Document {
  name: string;
  pages: Array<Page>;
}
