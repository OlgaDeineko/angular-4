import { ICategoryResponse } from './i-category-response';
import { ILang } from './i-lang';
import { ICategoryHierarchical } from './i-category-hierarchical';
import { IFaq } from './i-faq';
export interface ICategory extends ICategoryResponse {
  language?: ILang;
  faqs?: IFaq[];
  categories?: ICategory[];
  parent?: ICategory;
  type?: string;
  hierarchical?: ICategoryHierarchical;
  expanded?: boolean;
  showFaq?: number;
  translation_key?: string;
  myTranslation?: {
    en?: ICategory,
    nl?: ICategory,
    fr?: ICategory,
    de?: ICategory
  }
}
