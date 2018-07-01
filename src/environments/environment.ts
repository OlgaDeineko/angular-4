// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  test: false,
  development: true
};

export const API_URL = '/api/v1';

export const API_DOMAIN = 'myanswers.io';

export const PROTOCOL = 'https:';

export const MAIN_DOMAIN = 'localhost:3000';

export const IS_LOCAL = true;

export const ALGOLIA_ID = 'I9WKUNVPGV';
export const ALGOLIA_KEY = '5a6dbbf12e7c8d629d22ec3197fe0186';

export const HELP_WIDGET_URL = 'https://cdn.myanswers.io/help-widget.js';
export const HELP_WIDGET_VERSION = '1.0.1';
