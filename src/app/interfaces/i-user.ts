import { IUserResponse } from './i-user-response';
export interface IUser extends IUserResponse {
  fullName: string,
  roleName: string,
  group?: any
}
