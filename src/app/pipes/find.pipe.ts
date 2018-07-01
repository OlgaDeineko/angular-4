import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {

  transform(arr: any[], key: string, value: any): any {
    return arr.find(item => item[key] === value);
  }

}
