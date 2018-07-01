import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpInterceptorService } from '../services/http-interceptor.service';
import { HttpHandlerService } from '../services/http-handler.service';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function createHttpInterceptor(backend: XHRBackend,
                                      defaultOptions: RequestOptions,
                                      $HttpHandler: HttpHandlerService) {
  return new HttpInterceptorService(backend, defaultOptions, $HttpHandler);
}
