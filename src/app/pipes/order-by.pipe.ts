import { Pipe, PipeTransform } from '@angular/core';

type TDirection = 'asc' | 'desc';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], key?: string): any {
    if (!key || key.length === 0) {
      return value;
    }

    let copy = [...value];

    let direction: TDirection = key[0] === '-' ? 'desc' : 'asc';
    key = key[0] === '-' ? key.slice(1) : key;

    return copy.sort((a, b) => {
      if (typeof a[key] === 'string' || typeof b[key] === 'string') {
        return this._compare(a[key].toLowerCase(), b[key].toLowerCase(), direction)
      } else {
        return this._compare(a[key], b[key], direction)
      }

    });
  }

  _compare(a: any, b: any, direction: TDirection): number {
    if (direction === 'desc') {
      return b > a ? 1 : -1;
    } else {
      return a < b ? -1 : 1;
    }
  }
}
