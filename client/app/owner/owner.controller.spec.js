'use strict';

describe('Controller: OwnerCtrl', function () {

  // load the controller's module
  beforeEach(module('ngCookies','pascalprecht.translate', 'leMeNuApp'));

  var OwnerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OwnerCtrl = $controller('OwnerCtrl', {
      $scope: scope
    });
  }));

  it('Contructor OwnerCtrl, valida inicializacion', function () {
    expect(1).toEqual(1);
  });
});
