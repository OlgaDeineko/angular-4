import { IFaqTag } from './i-faq-tag';
import { IFileResponse } from './i-file-response';
import { ICategoryResponse } from './i-category-response';
import { IFaqVisibility } from './i-faq-visibility';
import { ILang } from './i-lang';

export interface IFaqResponse {
  id: any;
  question: string;
  answer: string;
  slug: string;
  custom_slug: string;
  visibility: 'public' | 'private'| 'internal';
  is_open_comments: boolean;
  lang: ILang;
  author: string;
  author_href: string;
  status: string;
  algolia_object_id: number;
  created_at: number;
  updated_at: number;
  tags: IFaqTag[];
  hits_count: number;
  remarks: string;
  attachments: IFileResponse[];
  sort_order: number;
  categories: ICategoryResponse;
  granted_access: string[];
  allowed_visibilities: IFaqVisibility[];
  translation: [{
    id: string;
    lang: ILang;
    name: string;
    slug: string;
    translation_key: string;
  }];
  groups: string[];
}
