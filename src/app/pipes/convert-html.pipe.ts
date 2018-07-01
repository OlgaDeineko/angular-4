import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'convertHtml'
})
export class ConvertHtmlPipe implements PipeTransform {
  constructor(private $Sanitizer: DomSanitizer) {
  }

  transform(html: any): any {
    return this.$Sanitizer.bypassSecurityTrustHtml(html);
  }

}
