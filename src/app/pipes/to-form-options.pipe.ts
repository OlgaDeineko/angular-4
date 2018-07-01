import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IFormOptions } from '../interfaces/i-form-options';

@Pipe({
  name: 'toFormOptions'
})
export class ToFormOptionsPipe implements PipeTransform {

  observer: Observable<any>;

  transform(data: any, valueKey?: string, labelKey?: string, disabledFunc?: (obj: any) => boolean): Observable<IFormOptions[]> {

    if (!disabledFunc) {
      disabledFunc = () => false
    }

    if (!data) {
      return this.observer = new Observable(obs => {
        obs.next([])
      });
    }

    labelKey = labelKey || valueKey;

    if (data instanceof Observable) {
      this.observer = data;
    } else {
      this.observer = new Observable(obs => {
        obs.next(data)
      })
    }

    return this.observer.map(res => {
      if (res.length === 0) {
        return res;
      }

      return res.map(item => {
        if (typeof item === 'string') {
          return {
            value: item,
            label: item,
            disabled: disabledFunc(item)
          }
        } else {
          return {
            value: item[valueKey],
            label: item[labelKey],
            disabled: disabledFunc(item)
          }
        }
      });
    })
  }

}
