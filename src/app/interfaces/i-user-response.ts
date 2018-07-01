import { ISubdomainInfo } from './i-subdomain-info';

export interface IUserResponse {
  id: string,
  status: string,
  role: string[],
  email: string,
  phone: string;
  username: string,
  first_name: string,
  last_name: string,
  group_id: number,
  subdomains?: ISubdomainInfo[],
  department: string,
  created_at: string,
  permitted_resources?: {
    categories: string[],
    faq: string[]
  }
}
