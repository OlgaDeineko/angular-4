export interface ISubdomainInfo {
  id: number;
  subdomain: string;
  custom_subdomain: string;
  db_index: string;
  algolia_index: string;
  parent_site_id: number;
  subscription_plan: {
    id: number;
    code: string;
    name: string;
    score: number;
    rules: {
      powered_by: boolean;
      available_roles: string[];
    };
  };
}
