'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(module('leMeNuApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('Debe ser 3, lista de imagenes en el home', function() {
    expect(scope.slides.length).toBe(3);
  });
});