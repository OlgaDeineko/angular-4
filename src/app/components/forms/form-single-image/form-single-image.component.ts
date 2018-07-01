import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IMG_FILE_TYPES } from '../../../constants';
import { ToastService } from '../../../services/toast.service';
import { FormGroup } from '@angular/forms';
import { IFileAndBase } from '../../../interfaces/i-new-file';

@Component({
  selector: 'ma-form-single-image',
  templateUrl: './form-single-image.component.html',
  styleUrls: ['./form-single-image.component.scss']
})
export class FormSingleImageComponent implements OnChanges {

  @Input('form') form: FormGroup;
  @Input('name') name: string;
  @Input('label') label?: string;
  @Input('disabled') disabled?: boolean = null;
  @Input('id') id?: string;
  @Input('maxSize') maxSize?: number = null;

  oldImage: string = null;  // url
  newImage: IFileAndBase = null;

  @Output('onFileUploaded') onFileUploaded: EventEmitter<IFileAndBase> = new EventEmitter();
  @Output('onFileRemove') onFileRemove: EventEmitter<string> = new EventEmitter();

  constructor(private $Toast: ToastService) {
    this.id = this.id || this.name;

    this.checkError = this.checkError.bind(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.oldImage = this.form.controls[this.name].value || null;
    this.newImage = null;
  }

  checkError(file: File): boolean {
    let fileSize = file.size;
    let ext = file.name.match(/\.(.{2,4})$/)[1];

    if (!~IMG_FILE_TYPES.indexOf(ext)) {
      this.$Toast.error('MESSAGES.ERROR_IMAGE_TYPE');
      return true;
    }

    if (this.maxSize && fileSize > this.maxSize) {
      this.$Toast.error('MESSAGES.ERROR_IMAGE_SIZE');
      return true;
    }
    return false;
  }

  fileUploaded(file: IFileAndBase) {
    this.newImage = file;
    this.onFileUploaded.emit({
      file: file.file,
      base64: file.base64
    });

    /* ¯\_(ツ)_/¯
      In this place zonejs generated error: Uncaught TypeError: Cannot assign to read only property 'size' of object '[object File]'
      It's happens because in patchValue we trying cloning object of instance "File".
      I not sure but it's don't break work program. So I ignore it.
      P.S. instance "File" in form is bad idea TODO: need rewrite
    */
    this.form.controls[this.name].patchValue(this.newImage);
  }

  removeImage() {
    if (!this.newImage && this.oldImage) {
      this.onFileRemove.emit(this.name);
      this.oldImage = null;
    }
    this.newImage = null;
    this.form.controls[this.name].patchValue(null);
  }
}
