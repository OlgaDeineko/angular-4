import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { UrlService } from './url.service';

import { IFileResponse } from '../interfaces/i-file-response';
import { IFile } from '../interfaces/i-file';
import { IFileAndBase, INewFile } from '../interfaces/i-new-file';
import { IFileRequest } from '../interfaces/i-file-request';
import { IFileRemove } from '../interfaces/i-file-remove';

@Injectable()
export class FileService {
  constructor(private $Url: UrlService,
              private $http: Http) {
  }

  dataToRequest(file: INewFile | IFileAndBase): IFileRequest {
    if (!(<INewFile>file).name && (<IFileAndBase>file).file) {
      (<INewFile>file).name = (<IFileAndBase>file).file.name
    }
    return {
      base64: (<INewFile>file).base64.split(',')[1],
      type: (<INewFile>file).name.match(/.*\.(\w{3,4})$/)[1],
      name: (<INewFile>file).name.replace(/(\.\w{3,4})$/, '')
    }
  };

  responseToData(file: IFileResponse): IFile {
    let reg = new RegExp(`.*\\\/${file.model}\/\\d+\/(.*)$`);
    (<IFile>file).name = file.attachment_url.match(reg)[1];
    return <IFile>file;
  };

  create(files, type, objectId) {
    return this.$http
      .post(
        `${this.$Url.apiUrl}/attachments/${type}/${objectId}`,
        {files: files.map(this.dataToRequest)}
      )
      .map(res => res.json().data.map(f => this.responseToData(f)))
      .toPromise();
  };

  uploadImageForTinymce(files) {
    return this.$http
      .post(
        `${this.$Url.apiUrl}/attachments/faq_editor/0`,
        {files: files}
      )
      .map(res => res.json().data.map(f => this.responseToData(f)))
      .toPromise();
  };

  remove(file: IFileRemove) {
    this.$http.delete(`${this.$Url.apiUrl}/attachments/${file.model}/${file.model_id}/${file.name}`)
      .toPromise();
  };

  saveLogo(file: INewFile | boolean) {
    if (!file || !(<INewFile>file).base64) {
      return;
    }
    return this.$http
      .post(`${this.$Url.apiUrl}/settings/media/logo`, this.dataToRequest(<INewFile>file))
      .toPromise();
  };

  saveFavicon(file: INewFile | boolean) {
    if (!file || !(<INewFile>file).base64) {
      return;
    }
    return this.$http
      .post(`${this.$Url.apiUrl}/settings/media/favicon`, this.dataToRequest(<INewFile>file))
      .toPromise();
  };

  saveHeaderImage(file: INewFile | boolean) {
    if (!file || !(<INewFile>file).base64) {
      return;
    }
    return this.$http
      .post(`${this.$Url.apiUrl}/settings/media/header-image`, this.dataToRequest(<INewFile>file))
      .toPromise();
  };

  removeLogo() {
    this.$http.delete(`${this.$Url.apiUrl}/settings/media/logo`)
      .toPromise();
  };

  removeFavicon() {
    this.$http.delete(`${this.$Url.apiUrl}/settings/media/favicon`)
      .toPromise();
  };

  removeHeaderImage() {
    this.$http.delete(`${this.$Url.apiUrl}/settings/media/header-image`)
      .toPromise();
  };
}
