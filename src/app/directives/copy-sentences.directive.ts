import { AfterViewInit, Directive } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[maCopySentences]'
})
export class CopySentencesDirective implements AfterViewInit {
  intervalID: any;

  constructor(private $Translate: TranslateService) {
  }

  ngAfterViewInit() {
    this.intervalID = window.setInterval(this.myCallback(), 50);
  }

  myCallback() {
    let articleList = document.getElementsByTagName('code');
    if (articleList.length > 0) {
      let articleArray = [].slice.call(articleList);
      articleArray.forEach((article) => {
        article.setAttribute('class', 'copy-text');
        let span = document.createElement('span');
        span.setAttribute('class', 'copy-tooltip') ;
        article.onclick =  () => {
          document.execCommand('copy');
        };
        article.onmouseover = () => {
          article.style.cursor = 'pointer';
          span.textContent = this.translateString('Click to copy');
          article.after(span);
          // article.appendChild(span);
        };

        article.onmouseout = function () {
          this.style.cursor = 'default';
          span.remove();
        };

        article.addEventListener('copy', (event) => {
          event.preventDefault();
          if (event.clipboardData) {
            event.clipboardData.setData('text/plain', article.textContent);
            span.textContent = this.translateString('Copied') + '!';
          }
        });
      })
      clearInterval(this.intervalID);
    }
  }

  translateString(msg: string) {
    let message;
    this.$Translate.get(msg)
      .subscribe((translation) => {
        message = translation;
      });
    return message;
  }
}
