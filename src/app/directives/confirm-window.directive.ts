import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';

@Directive({
  selector: '[maConfirmWindow]'
})
export class ConfirmWindowDirective {
  @Input('confirmMessage') confirmMessage: string;
  @Output('onConfirmOk') onConfirmOk = new EventEmitter();
  @Output('onConfirmCancel') onConfirmCancel = new EventEmitter();

  constructor(private $modal: NgbModal) {
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    let options: NgbModalOptions = {};

    if (document.getElementsByClassName('modal-dialog').length) {
      options.container = 'div.modal-dialog';
    }

    let confirmModal = this.$modal.open(ConfirmModalComponent, options);

    confirmModal.componentInstance.answer = this.confirmMessage;

    confirmModal.result
      .then(res => {
        this.onConfirmOk.emit(null);
      }).catch((err) => {
      this.onConfirmCancel.emit(null);
    });
  }
}
