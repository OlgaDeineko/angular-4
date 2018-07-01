import { ISubdomainInfo } from './i-subdomain-info';

export interface ISubdomainsInfoResponce {
  owner_id?: string,
  subdomains: ISubdomainInfo[]
}
