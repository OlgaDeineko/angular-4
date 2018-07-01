import { Subject } from 'rxjs/Subject';
import { IHttpError } from '../interfaces/i-http-error';
import { RequestMethod } from '@angular/http';

export class ActiveRequests {
  requests = {};
  totalRequests = 0;
  finishedRequests = {};
  totalFinished = 0;

  httpError$: Subject<IHttpError> = new Subject();
  pending$: Subject<number> = new Subject();
  completed$: Subject<number> = new Subject();

  start(method: RequestMethod): void {
    let _method = RequestMethod[method];

    if (!this.requests.hasOwnProperty(_method)) {
      this.requests[_method] = 0;
    }

    this.requests[_method]++;
    this.totalRequests++;
    this.pending$.next(this.totalRequests)
  }

  end(method: RequestMethod): void {
    let _method = RequestMethod[method];

    if (!this.requests.hasOwnProperty(_method) || this.requests[_method] === 0) {
      return;
    }

    if (!this.finishedRequests.hasOwnProperty(_method)) {
      this.finishedRequests[_method] = 0;
    }

    this.requests[_method]--;
    this.totalRequests--;
    this.totalFinished++;
    this.finishedRequests[_method]++;

    if (this.totalRequests === 0) {
      this.completed$.next(0)
    }
  }
}
