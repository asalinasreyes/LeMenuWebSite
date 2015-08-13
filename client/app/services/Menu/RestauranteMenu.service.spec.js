'use strict';

describe('Service: Restaurant Menu', function () {

  // load the service's module
  beforeEach(module('leMeNuApp'));

  // instantiate service
  var RestaurantMenu;
  beforeEach(inject(function (_RestaurantMenu_) {
    RestaurantMenu = _RestaurantMenu_;
  }));

  it('should do something', function () {
    expect(!!RestaurantMenu).toBe(true);
  });

});
