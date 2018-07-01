import { INewFile } from './i-new-file';
import { ILabelsTranslation } from './i-labels-translation';
export interface IAppearance extends IAppearanceFiles {
  styles: IAppearanceStyle
  labels: ILabelsTranslation[]
}

export interface IAppearanceStyle {
  kbName?: string,
  kbSubtitle?: string,
  headColor?: string,
  linkColor?: string,
  footerColor?: string,
  kbTitleColor?: string,
  buttonColor?: string,
  menuBarColor?: string,
  buttonTextColor?: string,
  footerTitleColor?: string,
  bodyFont?: string,
  titleFont?: string,
  footerFont?: string,
  logoURL?: string,
  footerTitle?: string,
  contactURL?: string,
  searchText?: string,
  headerCode?: string,
  bodyCode?: string,
  liveChatScript?: string,
  liveChatUrl?: string,
  categoryTree?: string
}

export interface IAppearanceFiles {
  logo: string | boolean,
  favicon: string | boolean,
  header_image: string | boolean
}

export interface IAppearanceNewFiles {
  logo: any,
  favicon: any,
  header_image: any
}
