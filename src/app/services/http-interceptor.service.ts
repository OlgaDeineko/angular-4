import { Injectable } from '@angular/core';
import {
  ConnectionBackend,
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  Response
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { HttpHandlerService } from './http-handler.service';

@Injectable()
export class HttpInterceptorService extends Http {

  constructor(_backend: ConnectionBackend,
              _defaultOptions: RequestOptions,
              private $HttpHandler: HttpHandlerService) {
    super(_backend, _defaultOptions);
  }

  request(req: Request, options?: RequestOptionsArgs): Observable<Response> {

    this.$HttpHandler.setHeader(req, 'Client-Subdomain');
    this.$HttpHandler.setHeader(req, 'Authorization');
    this.$HttpHandler.onRequest(req);

    let response: Observable<Response> = super.request(req, options);

    return Observable
      .from(response)
      .do(_response => {
        this.$HttpHandler.onResponse(req, _response);
        if (_response.json().status === 0) {
          throw <Response>_response;
        }
        return <Response>_response;
      })
      .catch(_response => {
        this.$HttpHandler.onErrorResponse(req, _response);
        throw <Response>_response;
      })
      .first();
  }
}
