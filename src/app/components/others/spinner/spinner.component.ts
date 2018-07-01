import { Component, ViewEncapsulation } from '@angular/core';

import { HttpHandlerService } from '../../../services/http-handler.service';

@Component({
  selector: 'ma-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent {
  showSpinner: boolean = false;

  constructor(private $HttpHandler: HttpHandlerService) {
    $HttpHandler.pendingRequests$
      .subscribe(() => this.showSpinner = true);
    $HttpHandler.completedRequests$
      .subscribe(() => this.showSpinner = false);
  }
}
