import { MyanswersPage } from './app.po';
import {$, $$, browser, by, element, protractor} from 'protractor';

describe('myanswers App', () => {
  let page: MyanswersPage;
  let EC = protractor.ExpectedConditions;

  // beforeEach(() => {
  //   browser.get('https://store.ephox.com/my-account/');
  // });
  browser.waitForAngularEnabled(false);
  browser.get('https://store.ephox.com/my-account/');

  browser.sleep(3000);
  element(by.name('username')).sendKeys('anthony5');
  element(by.name('password')).sendKeys('#@m1G6H8gxW4');
  element(by.name('login')).click();
  browser.sleep(5000);
  browser.get('https://store.ephox.com/my-account/api-key-manager/');
  browser.sleep(5000);
  $('.button.view').click();
  browser.sleep(5000);
  $('#api-add-domain').click();
  browser.sleep(2000);
  $$('.api-domain').last().sendKeys(browser.params.subdomain);
  browser.sleep(2000);
  $('[value="Update API Key"]').click();
  browser.sleep(1000);
  browser.waitForAngularEnabled(true);


  it('should work', () => {
    // page.navigateTo();
    expect(1).toEqual(1);
  });
});
