import { Pipe, PipeTransform } from '@angular/core';
import { IFaq } from '../interfaces/i-faq';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'countFaqWords'
})
export class CountFaqWordsPipe implements PipeTransform {
  readingTime: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private $Translate: TranslateService) {
  }

  transform(faq: IFaq): BehaviorSubject<string> {
    if (!faq.answerWithoutTags) {
      return null;
    }
    let countWords = faq.answerWithoutTags.trim().split(/\s+/).length;
    let countChars = (faq.answerWithoutTags.match(/\S/g) || []).length;

    // @see http://marketingland.com/estimated-reading-times-increase-engagement-79830
    let time: string[] = (countWords / 200 + '').split('.');
    let timeReads = `${time[0]} min ${((+('.' + time[1]) * 60).toFixed())} sec`;

    this.$Translate
      .get([
        `FAQ.WORD${countWords > 1 ? 'S' : ''}`,
        `FAQ.CHARACTER${countChars > 1 ? 'S' : ''}`,
        `FAQ.READING_TIME`,
      ])
      .subscribe((translation) => {
        let keys = Object.keys(translation);
        this.readingTime
          .next(`${countWords} ${translation[keys[0]]}, ${countChars} ${translation[keys[1]]}, ${timeReads} ${translation[keys[2]]}`);
      });

    return this.readingTime;
  }
}
