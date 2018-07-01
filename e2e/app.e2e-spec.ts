import { MyanswersPage } from './app.po';

describe('myanswers App', () => {
  let page: MyanswersPage;

  beforeEach(() => {
    page = new MyanswersPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to ma!!');
  });
});
