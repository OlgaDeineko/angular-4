import { ResponseErrors } from '../enums/response-errors.enum';
import { ResponseStatuses } from '../enums/response-statuses.enum';

export interface IHttpError {
  error: ResponseErrors
  status: ResponseStatuses
  realStatus: ResponseStatuses
}
