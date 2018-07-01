import { IUserResponse } from './i-user-response';
export interface IUserResponseFull extends IUserResponse {
  access_token: string,
  refresh_token: string,
  token_type: string,
  expire_in: number,
}
