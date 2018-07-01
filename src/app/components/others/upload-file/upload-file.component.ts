import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IFileAndBase } from '../../../interfaces/i-new-file';

@Component({
  selector: 'ma-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @ViewChild('fileUpload') fileUpload: ElementRef;

  @Output('onFileUploaded') onFileUploaded: EventEmitter<IFileAndBase> = new EventEmitter();
  @Input('checkError') checkError: (file: File) => boolean = file => false;

  fileChange($event: Event): void {
    let target: HTMLInputElement = <HTMLInputElement> $event.target;
    let file: File = target.files[0];
    if (!file) {
      return;
    }

    if (typeof this.checkError === 'function' && this.checkError(file)) {
      target.value = null;
      return;
    }

    let reader = new FileReader();

    reader.onload = (ev) => {
      let newFile = (<FileReader> ev.target).result;
      this.onFileUploaded.emit({
        file: file,
        base64: (<string> newFile)
      });
      target.value = null;
    };

    reader.readAsDataURL(file);
  }

  open() {
    this.fileUpload.nativeElement.click();
  }
}
