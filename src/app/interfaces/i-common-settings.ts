import { IDepartment } from './i-department';
import { ILang } from './i-lang';
import { ICategoriesVisibility } from './i-categories-visibility';
import { IFaqStatuses } from './i-faq-statuses';
import { IFaqVisibility } from './i-faq-visibility';
import { IRoles } from './i-roles';
export interface ICommonSettings {
  categories_visibility: ICategoriesVisibility[];
  departments: IDepartment[];
  faq_statuses: IFaqStatuses[];
  faq_visibility: IFaqVisibility[];
  languages: ILang[];
  roles: IRoles[];
}
