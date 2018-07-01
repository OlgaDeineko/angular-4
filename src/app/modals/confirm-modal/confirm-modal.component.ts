import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ma-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  answer: string;

  constructor(public $Modal: NgbActiveModal) { }

  ok() {
    this.$Modal.close(true);
  }

  cancel() {
    this.$Modal.dismiss('cancel');
  }

}
