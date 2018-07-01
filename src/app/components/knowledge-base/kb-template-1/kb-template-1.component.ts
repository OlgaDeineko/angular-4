import { Component, Input } from '@angular/core';
import { VisitorComponent } from '../../../pages/visitor/visitor.component';

@Component({
  selector: 'ma-kb-template-1',
  templateUrl: './kb-template-1.component.html',
  styleUrls: ['./kb-template-1.component.scss']
})
export class KbTemplate1Component {
  @Input('ctrl') ctrl: VisitorComponent;
}
