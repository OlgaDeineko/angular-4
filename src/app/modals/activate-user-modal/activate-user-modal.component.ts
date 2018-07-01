import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ma-activate-user-modal',
  templateUrl: './activate-user-modal.component.html',
  styleUrls: ['./activate-user-modal.component.scss']
})
export class ActivateUserModalComponent {
  email: string;

  constructor(public $Modal: NgbActiveModal) {
  }

  cancel() {
    this.$Modal.dismiss('cancel');
  }

}
