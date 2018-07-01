import { ILang } from './i-lang';

export interface ILanguages {
  allowed_for_home_page: ILang[];
  allowed_languages: ILang[];
  default_system_language: ILang;
  user_language: ILang;
}
