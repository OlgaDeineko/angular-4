export enum ResponseErrors {
  subdomainNotExist,
  forbidden,
  notFound,
  unauthorized,
  authChanged,  // case for changing password - old password is wrong
  backEnd,
  invalidCredentials,
  iDontKnow  // ¯\_(ツ)_/¯
}
