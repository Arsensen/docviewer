import type { IPage } from './page.interface';

export interface IDocument {
  name: string;
  pages: Array<IPage>;
}
