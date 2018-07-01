import { Component, Input } from '@angular/core';
import { VisitorFaqComponent } from '../../../pages/visitor-faq/visitor-faq.component';

@Component({
  selector: 'ma-kb-faq-template-1',
  templateUrl: './kb-faq-template-1.component.html',
  styleUrls: ['./kb-faq-template-1.component.scss']
})
export class KbFaqTemplate1Component {
  @Input('ctrl') ctrl: VisitorFaqComponent;
}
