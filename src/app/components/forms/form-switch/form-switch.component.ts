import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'ma-form-switch',
  templateUrl: './form-switch.component.html',
  styleUrls: ['./form-switch.component.scss']
})
export class FormSwitchComponent implements OnInit {

  @Input('form') form?: FormGroup;
  @Input('formElement') formElement?: FormGroupDirective;
  @Input('name') name: string;
  @Input('label') label?: string;
  @Input('disabled') disabled?: boolean | null = null;
  @Input('id') id?: string;
  @Input('values') values?: { on: any, off: any } = {on: true, off: false};
  @Input('status') status?: boolean;
  @Input('type') type?: 'primary' | 'success' | 'danger' | 'warn' = 'primary';
  @Input('confirmMessage') confirmMessage?: boolean | null = null;
  @Input('confirmMessageText') confirmMessageText?: string;
  @Input('confirmMessageOnValue') confirmMessageOnValue?: string;
  precondition: boolean;

  constructor(private $modal: NgbModal) {
  }

  ngOnInit() {
    if (!this.form && this.formElement) {
      this.form = this.formElement.form;
    }

    this.status = this.values.on === this.form.controls[this.name].value;

    this.disabled = this.disabled ? true : null;

    this.id = this.id || this.name;
  }

  change() {
    if (this.disabled) {
      return
    }
    if (this.confirmMessage) {
      this.precondition = !JSON.parse(this.values[this.confirmMessageOnValue]);
      if (this.confirmMessage === true && this.status === this.precondition) {
        let confirmModal = this.$modal.open(ConfirmModalComponent);

        confirmModal.componentInstance.answer = this.confirmMessageText;

        confirmModal.result
          .then(res => {
            this.status = !this.status;
            this.form.controls[this.name].setValue(this.values[this.status ? 'on' : 'off'])
          }).catch(() => {
        });
      } else {
        this.status = !this.status;
        this.form.controls[this.name].setValue(this.values[this.status ? 'on' : 'off'])
      }
    } else {
      this.status = !this.status;
      this.form.controls[this.name].setValue(this.values[this.status ? 'on' : 'off'])
    }
  }

}
