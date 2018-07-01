import {Directive, ElementRef, Input, OnChanges} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Directive({
  selector: '[maRoleAccess]'
})
export class RoleAccessDirective implements OnChanges {
  @Input() visibleFor: string[];
  @Input() invisibleFor: string[];
  @Input() disableFor: string[];
  @Input() disableIf: boolean;

  constructor(private $Auth: AuthService,
              private $el: ElementRef) {
  }

  ngOnChanges(changes) {
    let $element: HTMLElement = this.$el.nativeElement;
    if (this.$Auth.isLogin()) {
      this.$Auth.getCurrentUser().then(() => {
        if (changes.visibleFor) {
          if (!this.$Auth.hasPermission(this.visibleFor)) {
            $element.remove();
          }
        }

        if (changes.invisibleFor) {
          if (this.$Auth.hasPermission(this.invisibleFor)) {
            $element.remove();
          }
        }

        if (changes.disableFor || changes.disableIf) {
          if (!this.disableFor) {
            return;
          }

          $element.removeAttribute('disabled');
          this.removeClass($element, 'disabled');

          let check = this.$Auth.hasPermission(this.disableFor);
          if (this.disableIf !== undefined) {
            check = check && this.disableIf;
          }

          if (check) {
            this.addClass($element, 'disabled');
            $element.setAttribute('disabled', 'true');
          }
        }
      });
    }
  }


  addClass($element: HTMLElement, className: string) {
    if ($element.className.indexOf(className) === -1) {
      $element.className += ` ${className}`;
    }
  }

  removeClass($element: HTMLElement, className: string) {
    $element.className = $element.className.replace(className, '');
  }
}
