import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Pipe({
  name: 'formValidationErrors'
})
export class FormValidationErrorsPipe implements PipeTransform {
  error: BehaviorSubject<string> = new BehaviorSubject('');
  suffix = 'FORMS.VALIDATIONS.';

  constructor(private $Translate: TranslateService) {
  }

  transform(error: string, label?: string, messages?: object): BehaviorSubject<string> {
    let keys = Object.keys(error);
    let translationCode = '';

    if (keys.length === 0) {
      return;
    }

    switch (keys[0]) {
      case 'required':
        translationCode = 'OBJECT_REQUIRED';
        break;
      case 'maxlength':
        translationCode = 'STRING_LENGTH_LONG';
        break;
      case 'minlength':
        translationCode = 'STRING_LENGTH_SHORT';
        break;
      case 'pattern':
        translationCode = 'STRING_PATTERN';
        break;
      case 'passwordMismatch':
        translationCode = 'PASSWORD_MISMATCH';
        break;
      default:
        return
    }

    translationCode = messages[keys[0]] || this.suffix + translationCode;

    this.$Translate
      .get(label)
      .subscribe((field) => {
        this.$Translate
          .get(translationCode, Object.assign({field}, error[keys[0]]))
          .subscribe((translation) => {
            this.error.next(translation);
          })
      });

    return this.error
  }

}
