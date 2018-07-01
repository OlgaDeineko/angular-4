import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportCsvModalComponent } from '../../modals/import-csv-modal/import-csv-modal.component';
import {
  IFaqStructureCustomer,
  IFaqStructureDefaultValues,
  IFaqStructureTarget
} from '../../interfaces/i-faq-structure';
import { SettingService } from '../../services/setting.service';
import { ToastService } from '../../services/toast.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree.service';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'ma-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  arrow = [];
  csv_structure = false;
  fileID: number;
  customer_structure: IFaqStructureCustomer[];
  target_structure: IFaqStructureTarget[];
  default_values: IFaqStructureDefaultValues[];
  structure_code = [];
  split_by: string;
  importForm: FormGroup;
  importStructureForm: FormGroup;

  constructor(private $modal: NgbModal,
              private $Setting: SettingService,
              private $Auth: AuthService,
              private $Router: Router,
              private $Tree: TreeService,
              private $Session: SessionService,
              private $Toast: ToastService) {
  }

  ngOnInit() {
    if (this.$Session.fileStructure.data) {
      let fileStructure = this.$Session.fileStructure.data;
      this.customer_structure = fileStructure.customer;
      this.target_structure = fileStructure.target;
      this.default_values = fileStructure.default_values;
      this.fileID = fileStructure.id;
      this.customer_structure.unshift({key: '', title: ''});
      this.customer_structure.forEach((s) => {
        this.structure_code.push({customer_key: '', target_key: ''})
      });
      for (let i = 0; i < this.target_structure.length; ++i) {
        this.structure_code[i] = {customer_key: '', target_key: this.target_structure[i].key};
      }
      this.csv_structure = true;
      this.importStructureForm = this.toFormGroup(this.target_structure, false);
      this.importForm = this.toFormGroup(this.default_values, true);
    }
  }

  open() {
    let importdataModal = this.$modal.open(ImportCsvModalComponent);
    importdataModal.result
      .then((result) => {
        this.customer_structure = result.customer;
        this.target_structure = result.target;
        this.default_values = result.default_values;
        this.fileID = result.id;
        this.customer_structure.unshift({key: '', title: ''});
        this.customer_structure.forEach((s) => {
          this.structure_code.push({customer_key: '', target_key: ''})
        });
        for (let i = 0; i < this.target_structure.length; ++i) {
          this.structure_code[i] = {customer_key: '', target_key: this.target_structure[i].key};
        }
        this.csv_structure = true;
        this.importStructureForm = this.toFormGroup(this.target_structure, false);
        this.importForm = this.toFormGroup(this.default_values, true);
      }).catch((err) => {
      console.error(err);
    });
  }

  submit() {
    this.target_structure.forEach((t) => this.importStructureForm.controls[t.key].markAsTouched());
    this.default_values.forEach((d) => this.importForm.controls[d.key].markAsTouched());
    let str = this.structure_code.filter(s => s.customer_key !== '');
    if (this.importForm.valid === true && this.importStructureForm.valid) {
      let default_values = this.importForm.getRawValue();
      default_values.author = this.$Auth.getFullName();
      let map = {
        mapping: str,
        default_values: default_values
      };
      this.$Setting.saveFileMapping(this.fileID, map).then(() => {
        this.$Session.fileStructure.remove();
        this.$Toast.success('MESSAGES.FILE_STRUCTURE_SAVED');
        this.$Tree.rebuildTree();
        this.$Router.navigate(['/admin']);
      }).catch((err) => {
        console.error(err);
      });
    } else {
      this.$Toast.errorOne('MESSAGES.SELECT_REQUIRED_VALUES');
    }
  }

  checked(i, item) {
    this.structure_code[i].customer_key = item;
    if (item !== '') {
      document.getElementById('arrow' + i).style.color = 'green';
    } else {
      document.getElementById('arrow' + i).style.color = '#bfbfbf';
    }
  }

  addPattern(split_by, i) {
    if (split_by !== '') {
      this.structure_code[i]['pattern'] = {split_by: split_by}
    } else {
      delete this.structure_code[i]['pattern'];
    }
  }

  toFormGroup(structure: IFaqStructureTarget[], defaultV: boolean) {
    let group: any = {};

    structure.forEach(str => {
      group[str.key] = (str.key === 'answer' || str.key === 'question') ? new FormControl('', Validators.required) : new FormControl('');
      if (str.key === 'category') {
        group['split_by'] = new FormControl('');
      }
      if (defaultV) {
        this.default_values.forEach((val) => {
          if (val.key === str.key) {
            group[str.key] = new FormControl(val.enum[0], Validators.required);
          }
        });
      }
    });
    return new FormGroup(group);
  }
}
