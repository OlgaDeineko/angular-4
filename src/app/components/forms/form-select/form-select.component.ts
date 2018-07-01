import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

import { IFormOptions } from '../../../interfaces/i-form-options';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ma-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss']
})
export class FormSelectComponent implements OnInit, OnChanges {

  @ViewChild('selectButton') selectButton: ElementRef;

  @Input('form') form?: FormGroup;
  @Input('formElement') formElement?: FormGroupDirective;
  @Input('name') name: string;
  @Input('label') label?: string;
  @Input('placeholder') placeholder? = '';
  @Input('disabled') disabled?: boolean = null;
  @Input('id') id?: string;
  @Input('messages') messages?: object = {};
  @Input('options') options?: Observable<IFormOptions[]>;
  @Input('translatePrefix') translatePrefix? = '';
  @Input('translateSuffix') translateSuffix? = '';
  @Input('icon') icon?: string = null;
  @Input('comingSoon') comingSoon?: boolean = false;
  @Input('withActionButton') withActionButton?: boolean = false;
  @Input('actionButtonLabel') actionButtonLabel?: string = 'Action';

  @Input('confirmMessage') confirmMessage?: boolean | null = null;
  @Input('confirmMessageText') confirmMessageText?: string;

  @Output('onChangeCallback') onChangeCallback?: EventEmitter<any> = new EventEmitter();
  @Output('onClickActionButton') onClickActionButton?: EventEmitter<any> = new EventEmitter();

  currentChanged: IFormOptions = {value: null, label: '', disabled: false};
  isOpen = false;

  @Input('isShowActionButton') isShowActionButton?: (option: IFormOptions) => boolean = (option) => true;

  constructor() {
  }

  ngOnInit() {
    if (!this.form && this.formElement) {
      this.form = this.formElement.form;
    }

    this.disabled = this.disabled ? true : null;

    this.options.subscribe(res => {
      this.currentChanged = res.find(opt => opt.value === this.form.controls[this.name].value) || {
        value: this.form.controls[this.name].value,
        label: this.form.controls[this.name].value,
        disabled: false
      };
    });

    this.id = this.id || this.name;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.options.subscribe(res => {
        this.currentChanged = res.find(opt => opt.value === this.form.controls[this.name].value) || {
          value: this.form.controls[this.name].value,
          label: this.form.controls[this.name].value,
          disabled: false
        };
      })
    } else {
      this.form.controls[this.name].setValue(changes.form.currentValue.value[this.name]);
      this.currentChanged = {
        value: changes.form.currentValue.value[this.name],
        label: changes.form.currentValue.value[this.name],
        disabled: false
      };
    }
  }

  /**
   * change value
   * @param {IFormOptions} option
   */
  change(option: IFormOptions) {
    this.form.controls[this.name].setValue(option.value);
    this.currentChanged = option;
    this.isOpen = false;
    this.form.controls[this.name].markAsTouched();
    this.onChangeCallback.emit(option);
  }

  /**
   * open select menu
   */
  openSelect() {
    if (this.isOpen) {
      this.form.controls[this.name].markAsTouched();
    }
    this.isOpen = !this.isOpen;
  }

  clickActionButton(option: IFormOptions) {
    this.onClickActionButton.emit(option);
  }

  /**
   * click outside (close select menu)
   * @param {MouseEvent} event
   * @param {HTMLElement} targetElement
   */
  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    let clickOnElement = targetElement === this.selectButton.nativeElement;

    if (this.isOpen && !clickOnElement) {
      this.isOpen = false;
      this.form.controls[this.name].markAsTouched();
    }
  }
}
