import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelButtonDirective } from './cancel-button.directive';
import { ConfirmWindowDirective } from './confirm-window.directive';
import { ConfirmPasswordDirective } from './confirm-password.directive';
import { RoleAccessDirective } from './role-access.directive';
import { CopySentencesDirective } from './copy-sentences.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RoleAccessDirective,
    ConfirmPasswordDirective,
    ConfirmWindowDirective,
    CancelButtonDirective,
    CopySentencesDirective,
  ],
  exports: [
    RoleAccessDirective,
    ConfirmPasswordDirective,
    ConfirmWindowDirective,
    CancelButtonDirective,
    CopySentencesDirective,
  ]
})
export class DirectivesModule {
}
