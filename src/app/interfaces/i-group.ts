import { IUser } from './i-user';
import { ISubdomainInfo } from './i-subdomain-info';

export interface IGroup {
  id: number,
  name: string,
  shared_subdomains_indexes: string[],
  user_ids: string[],
  permitted_resources?: {
    categories: string[],
    faq: string[]
  },
  users?: IUser[];
  subdomains?: ISubdomainInfo[];
}
