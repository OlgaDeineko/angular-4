import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Editor } from 'tinymce';

// constants
import { IMG_FILE_TYPES } from '../../../constants';

// services
import { ToastService } from '../../../services/toast.service';
import { FileService } from '../../../services/file.service';

// interfaces
import { IMaWindow } from '../../../interfaces/i-ma-window';
import { IFileAndBase } from '../../../interfaces/i-new-file';


@Component({
  selector: 'ma-tiny-mce',
  templateUrl: './tiny-mce.component.html',
  styleUrls: ['./tiny-mce.component.scss']
})
export class TinyMceComponent implements OnDestroy, AfterViewInit {

  @ViewChild('faqTinyMce') faqTinyMce: ElementRef;
  @ViewChild('fileUpload') fileUpload;

  @Input('options') options?: any;
  @Input('model') model: string;
  @Output('modelChange') modelChange: EventEmitter<string> = new EventEmitter<string>();
  @Output('onFileUploaded') onFileUploaded: EventEmitter<any> = new EventEmitter<any>();

  editor: Editor;
  callback: any;

  constructor(private $Toast: ToastService,
              private $File: FileService) {
    this.checkError = this.checkError.bind(this);
  }

  ngAfterViewInit() {
    (window as IMaWindow).tinymce.ScriptLoader.load('https://cloud.tinymce.com/stable/plugins.min.js?apiKey=tfukqjcabku2hy925qxsw9fopyx8srz041ecc28xbf44h37u');
    (window as IMaWindow).tinymce.baseURL = '/assets/tinyMCE';
    (window as IMaWindow).tinymce.init({
      target: this.faqTinyMce.nativeElement,
      baseURL: '/assets/tinyMCE/',
      skin_url: '/assets/tinyMCE/skins/lightgray',
      linkchecker_service_url: 'https://hyperlinking.tinymce.com',
      linkchecker_api_key: 'tfukqjcabku2hy925qxsw9fopyx8srz041ecc28xbf44h37u',
      spellchecker_api_key: 'tfukqjcabku2hy925qxsw9fopyx8srz041ecc28xbf44h37u',
      spellchecker_rpc_url: 'https://spelling.tinymce.com',
      spellchecker_language: 'nl',
      extended_valid_elements: 'i[class]',
      content_style: '.img-responsive {max-width: 100%;}  ' +
      '.isa_info {\n' +
      '  color: #00529B;\n' +
      '  background-color: #BDE5F8;\n' +
      '} .isa_success {\n' +
      '  color: #4F8A10;\n' +
      '  background-color: #DFF2BF;\n' +
      '}\n' +
      '.isa_warning {\n' +
      '  color: #9F6000;\n' +
      '  background-color: #FEEFB3;\n' +
      '}\n' +
      '.isa_error {\n' +
      '  color: #D8000C;\n' +
      '  background-color: #FFD2D2;\n' +
      '}\n' +
      '.isa_info i, .isa_success i, .isa_warning i, .isa_error i {\n' +
      '  margin:10px 22px;\n' +
      '  font-size:2em;\n' +
      '  vertical-align:middle;\n' +
      '}',
      content_css: '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      setup: editor => {
        this.editor = editor;
        editor.on('change', () => {
          this.modelChange.emit(editor.getContent());
        });
        // it's bullshit!!! it's a crutch!!!! need find another way. Olga! DON'T COPYPASTE!!! this code never
        editor.on('remove', () => {
          let notifications = editor.notificationManager.getNotifications();
          while (notifications.length) {
            notifications[0].close();
            notifications = editor.notificationManager.getNotifications();
          }
        });
        function toHtml(type, icon, title?) {
          return `<div class="isa_${type}"><i class="fa fa-${icon}"></i>
            ${title}
          </div><span id="caret_pos_holder">&nbsp;</span>`;
        }

        function openWindowManager(title, type, icon) {
          editor.windowManager.open({
            title: title,
            body: [
              {type: 'textbox', multiline: true, scrollbars: true, name: 'title', minHeight: 400, minWidth: 500}
            ],
            onsubmit: function(e) {
              // Insert content when the window form is submitted
              let html = toHtml(type, icon, e.data.title);
              editor.insertContent(html);

              let endId = (window as IMaWindow).tinymce.DOM.uniqueId();
              editor.dom.add(editor.getBody(), 'span', {'id': endId}, '');

              let newNode = editor.dom.select('span#' + endId);
              editor.selection.select(newNode[0]);
              editor.windowManager.close();
            }
          });
        }

        function insertMessageInfo() {
          openWindowManager('Add info message', 'info', 'info-circle');
        }

        editor.addButton('infomessage', {
          icon: 'info',
          tooltip: 'Insert info message',
          onclick: insertMessageInfo
        });

        function insertMessageSuccess() {
          openWindowManager('Add success message', 'success', 'check');
        }

        editor.addButton('successmessage', {
          icon: 'checkmark',
          tooltip: 'Insert success message',
          onclick: insertMessageSuccess
        });

        function insertMessageWarning() {
          openWindowManager('Add warning message', 'warning', 'warning');
        }

        editor.addButton('warningmessage', {
          icon: 'warning',
          tooltip: 'Insert warning message',
          onclick: insertMessageWarning
        });

        function insertMessageError() {
          openWindowManager('Add error message', 'error', 'times-circle');
        }

        editor.addButton('errormessage', {
          icon: 'remove',
          tooltip: 'Insert error message',
          onclick: insertMessageError
        });
      },
      init_instance_callback: function (editor) {
        editor.on('PastePreProcess', function (e) {
          if ( e.content.includes('MCEPASTEBIN')) {
            e.content = '';
          }
        });
      },
      images_upload_handler: this.imagesUploadHandler.bind(this),
      file_picker_callback: this.uploadFileForTinimce.bind(this),

      ...this.options,
    });
  }

  imagesUploadHandler(blobInfo, success, failure) {
    this.$File.uploadImageForTinymce([{
      name: `${Math.random().toString(36).substring(2)}`,
      type: blobInfo.blob().type.match(/.*\/(\w{3,4})$/)[1],
      base64: blobInfo.base64()
    }
    ])
      .then((result) => {
        success(result[0].attachment_url)
      });
  }


  uploadFileForTinimce(callback, value, meta) {
    this.callback = callback;
    if (meta.filetype === 'image') {
      this.fileUpload.open();
    }
  };

  checkError(file: File): boolean {
    let ext = file.name.match(/\.(.{2,4})$/)[1];
    if (!~IMG_FILE_TYPES.indexOf(ext)) {
      this.$Toast.error('MESSAGES.ERROR_IMAGE_TYPE');
      return true;
    }
    return false;
  }


  fileChange(file: IFileAndBase) {
    let fileName = `${Math.random().toString(36).substring(2)}${file.file.name.match(/.*(\.\w{3,4})$/)[1]}`;
    this.$File.create([{name: fileName, base64: file.base64}], 'faq_editor', '0')
      .then((result) => {
        this.callback(result[0].attachment_url, {
          alt: ''
        });
      });
  };

  ngOnDestroy() {
    if (this.editor) {
      (window as IMaWindow).tinymce.remove(this.editor);
    }
  }
}
