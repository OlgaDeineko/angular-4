import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Pipe({
  name: 'bigList'
})
export class BigListPipe implements PipeTransform {
  transform(value: any[]): BehaviorSubject<any> {
    let result: BehaviorSubject<any[]> = new BehaviorSubject([]);
    let length: number = value.length;
    let iterator: number = 0;

    let timer = () => {
      setTimeout(() => {
        if (iterator !== length) {
          result.next(value.slice(0, iterator + 1));
          iterator += 1;
          timer();
        }
      }, 10)
    };

    timer();
    return result;
  }
}
