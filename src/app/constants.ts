export const EMAIL_PATTERN = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;

export const PASSWORD_PATTERN = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;

export const LIVE_CHAT_URL_PATTERN = /^(http(s)?:\/\/)?lc\.chat\/now\//;

export const APPEARANCE_URL_PATTERN = /^(http(s)?:\/\/)(.*)/;

export const DEFAULT_LANG = 'nl';
export const DEFAULT_LANG_NAME = 'Dutch';
export const DEFAULT_FILTER = 'NAME_ASC';

export const REGISTRATION_URL = 'https://register.myanswers.io/';

export const IMG_FILE_TYPES = ['png', 'gif', 'jpg', 'jpeg'];
export const DOC_FILE_TYPES = ['doc', 'docx', 'pdf'];
export const IMPORT_FILE_TYPES = ['xls', 'xlsx', 'csv'];

export const AVAILABLE_LANGUAGES = [
  {code: 'nl', name: 'Dutch'},
  {code: 'en', name: 'English'},
  {code: 'de', name: 'German'},
  {code: 'fr', name: 'French'},
  {code: 'es', name: 'Spanish'},
  {code: 'it', name: 'Italian'},
  {code: 'pl', name: 'Polish'},
  {code: 'sv', name: 'Swedish'},
  {code: 'da', name: 'Danish'},
  {code: 'fi', name: 'Finnish'}
  ];

