import { ISubdomainInfo } from './i-subdomain-info';

export interface IUserNew {
  id?: string;
  first_name: string,
  last_name: string,
  email: string,
  roleName: string,
  department: string,
  group_id: number,
  subdomains: ISubdomainInfo[],
}
