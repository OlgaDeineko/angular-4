import { Injectable, Injector } from '@angular/core';
import { Toast, ToasterService } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { Response } from '@angular/http';

import { SessionService } from './session.service';
import { IMessageAfterReload } from '../interfaces/i-message-after-reload';

@Injectable()
export class ToastService {
  constructor(public toasterService: ToasterService,
              private $Session: SessionService,
              private $Injector: Injector) {

  }

  private get $Translate(): TranslateService {
    return this.$Injector.get(TranslateService)
  }

  private _showToast(type: string, messages: string | string[], titleMessage: string): void {
    if (!messages) {
      return;
    }

    if (!Array.isArray(messages)) {
      messages = [messages] as string[];
    }
    this.$Translate
      .get(titleMessage)
      .subscribe((translationTitle) => {
        (<string[]>messages).forEach((msg) => {
          this.$Translate
            .get(msg)
            .subscribe((translation) => {
              let toast: Toast = {
                type: type,
                body: translation,
                title: translationTitle
              };
              this.toasterService.pop(toast);
            });
        })
      });
  }

  /**
   * success message
   * @param {string|string[]} messages
   * @param {string} [title='SUCCESS']
   */
  success(messages: string | string[], title: string = 'SUCCESS') {
    this._showToast('success', messages, title)
  };

  /**
   * one success message
   * @param {string|string[]} messages
   * @param {string} [title='SUCCESS']
   */
  successOne(messages: string | string[], title: string = 'SUCCESS') {
    this.toasterService.clear();
    this._showToast('success', messages, title)
  };

  /**
   * error message
   * @param {string|string[]} messages
   * @param {string} [title='ERROR']
   */
  error(messages: string | string[], title: string = 'ERROR') {
    return this._showToast('error', messages, title);
  };

  /**
   * one error message
   * @param {string|string[]} messages
   * @param {string} [title='ERROR']
   */
  errorOne(messages: string | string[], title: string = 'ERROR') {
    this.toasterService.clear();
    return this._showToast('error', messages, title);
  };

  /**
   * show errors from server
   * @param {object} errorResponse
   * @param {string} [title=''MESSAGES.VALIDATION_ERROR']
   */
  showServerErrors(errorResponse: Response, title: string = 'MESSAGES.VALIDATION_ERROR') {
    if (!errorResponse) {
      return;
    }

    let errorJson;
    if (typeof errorResponse.json === 'function') {
      errorJson = errorResponse.json();
    } else {
      errorJson = errorResponse;
    }

    if (errorJson.errors && Array.isArray(errorJson.errors)) {
      let messages = errorJson.errors.map((err) => err.message || err);
      return this._showToast('error', messages, title);
    }
  }

  showSavedMessage() {
    let messages: IMessageAfterReload [] = this.$Session.messagesAfterReload.data;
    if (messages && messages.length) {
      messages = this.uniquemessages(this.$Session.messagesAfterReload.data);
      messages.forEach(msg => this._showToast(msg.type, msg.messages, msg.title));
      this.$Session.messagesAfterReload.remove();
    }
  }

  uniquemessages(input) {
    return input.filter((mess, index, self) => self.findIndex((t) => {
      return t.messages === mess.messages && t.title === mess.title;
    }) === index);
  }
}
