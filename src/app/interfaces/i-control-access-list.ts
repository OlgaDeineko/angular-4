// TODO Type
export interface IControlAccessList {
  id: string,
  title: string,
  expanded: boolean,
  parent_id: string,
  lang?: string,
  checked: boolean,
  parents: string[],
  categories_t?: any,
  translation?: any,
  visibility?: string;
}
