import { Pipe, PipeTransform } from '@angular/core';

const icons = {
  flag: {
    'en': 'flag-icon flag-icon-gb',
    'nl': 'flag-icon flag-icon-nl',
    'de': 'flag-icon flag-icon-de',
    'fr': 'flag-icon flag-icon-fr',
    'es': 'flag-icon flag-icon-es',
    'it': 'flag-icon flag-icon-it',
    'pl': 'flag-icon flag-icon-pl',
    'sv': 'flag-icon flag-icon-sv',
    'da': 'flag-icon flag-icon-da',
    'fi': 'flag-icon flag-icon-fi'
  },
  visibility: {
    'public': 'fa fa-unlock-alt',
    'internal': 'fa fa-building',
    'private': 'fa fa-lock'
  }
}

@Pipe({
  name: 'iconClass'
})
export class IconClassPipe implements PipeTransform {
  transform(code: string, type: string): string {
    if ((type === 'flag' || type === 'visibility') && code) {
      return icons[type][code];
    } else {
      return '';
    }
  }

}
