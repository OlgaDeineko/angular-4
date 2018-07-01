import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../services/session.service';

@Directive({
  selector: '[maCancelButton]'
})
export class CancelButtonDirective implements OnInit {
  routeArray: any[];

  constructor(private $Router: Router,
              private $Session: SessionService,
              private el: ElementRef) {
  }

  ngOnInit() {
    let $element: HTMLElement = this.el.nativeElement;
    if (!this.$Session.previousPage.data) {
      $element.remove();
    }
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    let previous = this.$Session.previousPage.data;
    if (previous) {
      this.routeArray = previous.split('/');
      if (this.routeArray[1] !== 'admin') {
        this.routeArray[0] = 'admin';
        this.routeArray.pop();
        this.routeArray.pop();
        previous = this.routeArray.join('/');
        this.$Router.navigate([previous]);
      } else {
        this.$Router.navigate([previous]);
      }
    }
  }

}
