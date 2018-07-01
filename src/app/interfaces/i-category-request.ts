import { IFaqVisibility } from './i-faq-visibility';
import { ILang } from './i-lang';
export interface ICategoryRequest {
  name: string;
  parent_id: number;
  lang: ILang;
  author: string;
  sort_order: number;
  author_href: string;
  granted_access: string[];
  visibility: 'public' | 'private'| 'internal';
  allowed_visibilities?: IFaqVisibility[];
  type?: string;
  groups?: string[];
}
