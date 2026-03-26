import type { IAnnotation } from './annotation.interface';

export interface IPage {
  number: number;
  imageUrl: string;
  annotations: Array<IAnnotation>;
}
