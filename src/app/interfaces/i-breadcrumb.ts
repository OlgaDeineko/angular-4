import { ILang } from './i-lang';

export interface IBreadcrumb {
  name: string;
  lang: ILang;
  parent_slug: string;
  slug: string;
  type: string;
}
