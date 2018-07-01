import { IFaqResponse } from './i-faq-response';
import { ICategory } from './i-category';
import { ILang } from './i-lang';

export interface IFaq extends IFaqResponse {
  category?: ICategory;
  categoryId?: number;
  categorySlug?: string;
  language?: ILang;
  answerWithoutTags?: string;
  likes?: number;
  dislikes?: number;
  authorId?: string;
  isOwner?: boolean;
  type?: string;
  expanded?: boolean;
  fullCategoryName?: string;
}
