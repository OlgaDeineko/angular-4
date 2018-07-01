import { browser, by, element } from 'protractor';

export class MyanswersPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ma-root h1')).getText();
  }
}
