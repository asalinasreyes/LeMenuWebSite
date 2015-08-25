'use strict';

describe('Controller: PaymentownerCtrl', function () {

  // load the controller's module
  beforeEach(module('leMeNuApp'));

  var PaymentownerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaymentownerCtrl = $controller('PaymentownerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
