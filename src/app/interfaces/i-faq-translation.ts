import { IFaqTag } from './i-faq-tag';

export interface IFaqTranslation {
  question: string,
  answer: string,
  lang: string,
  author: string,
  new_tags: IFaqTag[] | string[],
  category_ids: number[],
  remarks: string
}
