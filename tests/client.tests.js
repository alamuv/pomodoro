const expect = require('chai').expect;

describe('TestController', () => {
  let $controller;

  beforeEach(inject((_$controller_) => {
    $controller = _$controller_;
  }));

  describe('test', () => {
    it('test', () => {
      expect(true).to.equal(true);
    });
  });
})