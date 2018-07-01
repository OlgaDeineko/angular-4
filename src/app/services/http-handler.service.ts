import { Injectable } from '@angular/core';
import { Request, Response, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

// constants
import { environment } from '../../environments/environment';

// classes
import { ActiveRequests } from '../classes/active-requests';

// enums
import { ResponseStatuses } from '../enums/response-statuses.enum';
import { ResponseErrors } from '../enums/response-errors.enum';

// interfaces
import { IHttpError } from '../interfaces/i-http-error';

// services
import { ToastService } from './toast.service';
import { SessionService } from './session.service';


@Injectable()
export class HttpHandlerService {
  private _activeRequests = new ActiveRequests();

  constructor(private $Session: SessionService,
              private $Toast: ToastService,
              private $Router: Router) {
  }

  get httpError$(): Subject<IHttpError> {
    return this._activeRequests.httpError$;
  }

  get pendingRequests$(): Subject<number> {
    return this._activeRequests.pending$;
  }

  get completedRequests$(): Subject<number> {
    return this._activeRequests.completed$;
  }

  setHeader(req: Request, nameHeader: string): void {
    if (!req || !nameHeader) {
      return;
    }

    nameHeader = nameHeader.toLowerCase();

    switch (nameHeader) {
      case 'client-subdomain':
        if (this.$Session.subdomain.data && /((myanswers\.io)|(localhost))/.test(window.location.host)) {
          if (!req.headers.has('Client-Subdomain')) {
            req.headers.append('Client-Subdomain', this.$Session.subdomain.data);
          }
        }
        break;
      case 'authorization':
        if (this.$Session.token.data) {
          req.headers.append('Authorization', `Bearer ${this.$Session.token.data}`);
        }
    }
  }

  onRequest(req: Request): void {
    this._activeRequests.start(req.method);
  }

  onResponse(req: Request, res: Response): void {
    this._activeRequests.end(req.method);

    this.logResponse('info', RequestMethod[req.method], res.url, {
      request: req,
      response: res,
      responseBody: res.json()
    });
  }

  onErrorResponse(req: Request, res: Response): void {
    this._activeRequests.end(req.method);

    this.logResponse('warn', RequestMethod[req.method], res.url, {
      request: req,
      response: res,
      responseBody: res.json()
    });

    this.responseErrorHandler(res)
  }

  responseErrorHandler(responseError: Response): void {
    let errorBody = responseError.json();
    switch (responseError.status) {
      case 403:
        if (errorBody.message === 'Missing or invalid access token') {
          this.$Toast.errorOne('MESSAGES.LOGIN_AGAIN', `MESSAGES.AUTHORIZATION_ERROR`);
          this.$Session.token.remove();
          this.$Router.navigateByUrl('/login');

          this.httpError$.next({
            error: ResponseErrors.invalidCredentials,
            status: ResponseStatuses.badRequest,
            realStatus: responseError.status
          });
          break;
        }

        if (errorBody.message === 'Subdomain does not exist') {
          this.$Router.navigateByUrl('/404');

          this.httpError$.next({
            error: ResponseErrors.subdomainNotExist,
            status: ResponseStatuses.notFound,
            realStatus: responseError.status
          });
          break;
        }

        if (errorBody.errors && errorBody.errors[0].message === 'Update of credentials failed') {
          this.httpError$.next({
            error: ResponseErrors.authChanged,
            status: ResponseStatuses.badRequest,
            realStatus: responseError.status
          });
          break;
        }

        this.$Toast.errorOne('MESSAGES.NOT_ACCESS');

        let previous = this.$Session.previousPage.data;
        if (previous) {
          this.$Router.navigateByUrl(previous);
          this.$Session.previousPage.remove();
        } else {
          this.$Router.navigateByUrl('/admin');
        }

        this.httpError$.next({
          error: ResponseErrors.forbidden,
          status: ResponseStatuses.forbidden,
          realStatus: responseError.status
        });
        break;
      case 401:
        this.$Session.messagesAfterReload.data = {
          type: 'error',
          messages: 'MESSAGES.LOGIN_AGAIN',
          title: 'MESSAGES.AUTHORIZATION_ERROR'
        };
        this.$Session.token.remove();

        this.httpError$.next({
          error: ResponseErrors.unauthorized,
          status: ResponseStatuses.unauthorized,
          realStatus: responseError.status
        });

        window.location.href = '/login';
        break;
      case 500:
        this.$Toast.error(errorBody.message, `Server error 500:`);
        this.httpError$.next({
          error: ResponseErrors.backEnd,
          status: ResponseStatuses.backEnd,
          realStatus: responseError.status
        });
        break;
      default:
        this.httpError$.next({
          error: ResponseErrors.iDontKnow,
          status: responseError.status,
          realStatus: responseError.status
        })
    }
  }

  logResponse(type: 'log' | 'info' | 'warn' | 'error', method: string, url: string, message: { request: Request, response: Response, responseBody: string }): void {
    if (!environment.production) {
      if (!(/(html|json)$/.test(url))) {
        console[type](method.toUpperCase(), url.match(/.*\/api\/(v1\/.*)$/)[1], message);
      }
    }
  }
}
