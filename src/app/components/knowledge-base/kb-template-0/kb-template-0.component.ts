import { Component, Input } from '@angular/core';
import { VisitorComponent } from '../../../pages/visitor/visitor.component';

@Component({
  selector: 'ma-kb-template-0',
  templateUrl: './kb-template-0.component.html',
  styleUrls: ['./kb-template-0.component.scss']
})
export class KbTemplate0Component {
  @Input('ctrl') ctrl: VisitorComponent;
}
