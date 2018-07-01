import { IFaqVisibility } from './i-faq-visibility';
export interface IFaqRequest {
  question: string;
  answer: string;
  visibility: string;
  is_open_comments: boolean;
  lang: string;
  author: string;
  status: string;
  new_tags: string[];
  tag_ids: number[];
  category_ids: number[];
  remarks: string;
  author_href: string;
  granted_access: string[];
}
