import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// constants
import { IMPORT_FILE_TYPES } from '../../constants';

// interfaces
import { IFileAndBase } from '../../interfaces/i-new-file';

// services
import { ToastService } from '../../services/toast.service';
import { SettingService } from '../../services/setting.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'ma-import-csv-modal',
  templateUrl: './import-csv-modal.component.html',
  styleUrls: ['./import-csv-modal.component.scss']
})
export class ImportCsvModalComponent {

  constructor(private $Toast: ToastService,
              private $Setting: SettingService,
              private $Session: SessionService,
              public $Modal: NgbActiveModal) {
    this.checkError = this.checkError.bind(this);
  }

  fileChange(file: IFileAndBase) {
    let fd = new FormData();
    fd.append('file', file.file);
    this.$Setting.importData(fd)
      .then((result) => {
        this.$Setting.getFileStructure(result.id)
          .then((res) => {
            res['id'] = result.id;
            this.$Session.fileStructure.data = res;
            this.$Modal.close(res);
          })
      })
  }

  checkError(file: File): boolean {
    let ext = file.name.match(/\.(.{2,4})$/)[1];
    if (!~IMPORT_FILE_TYPES.indexOf(ext)) {
      this.$Toast.error('MESSAGES.ERROR_IMPORT_TYPE');
      return true;
    }
    return false;
  }
}
