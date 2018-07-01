import { IRegistrEmailData } from './i-registr-email-data';
import { IRegistrPersonalInfoData } from './i-registr-personal-info-data';
import { IRegistrSubdomainData } from './i-registr-subdomain-data';
export interface IRegistrData extends IRegistrEmailData, IRegistrPersonalInfoData, IRegistrSubdomainData {
  settings: object;
}
