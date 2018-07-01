import { IFaqVisibility } from './i-faq-visibility';
import { IFaqTag } from './i-faq-tag';
import { ILang } from './i-lang';
export interface INewFaq {
  question: string;
  answer: string;
  categoryId: number;
  tags: IFaqTag[];
  visibility: string;
  author: string;
  lang?: ILang;
  is_open_comments: boolean;
  status: string;
  remarks: string;
  granted_access: string[];
  allowed_visibilities: IFaqVisibility[];
  type?: string;
  groups: string[];
}
