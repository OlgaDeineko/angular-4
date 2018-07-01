import { ICategoryRequest } from './i-category-request';
import { IFaqVisibility } from './i-faq-visibility';
import { ICategory } from './i-category';

// TODO: fix id in all interfaces
export interface ICategoryResponse extends ICategoryRequest {
  id: any;
  slug: string;
  parent_slug: string
  created_at: number;
  updated_at: number;
  allowed_visibilities: IFaqVisibility[];
  translation: ICategory[];
  groups: string[];
}
