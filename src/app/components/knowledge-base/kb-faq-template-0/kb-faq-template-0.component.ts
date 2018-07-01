import { Component, Input } from '@angular/core';
import { VisitorFaqComponent } from '../../../pages/visitor-faq/visitor-faq.component';

@Component({
  selector: 'ma-kb-faq-template-0',
  templateUrl: './kb-faq-template-0.component.html',
  styleUrls: ['./kb-faq-template-0.component.scss']
})
export class KbFaqTemplate0Component {
  @Input('ctrl') ctrl: VisitorFaqComponent;
}
