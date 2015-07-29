'use strict';

describe('Controller: WellcomeCtrl', function () {

  // load the controller's module
  beforeEach(module('leMeNuApp'));

  var WellcomeCtrl, scope, mylocation, auth;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location,Auth ) {
    scope = $rootScope.$new();
    mylocation = $location;
    auth = Auth;
    WellcomeCtrl = $controller('WellcomeCtrl', {
      $scope: scope
    });
  }));

  it('Default instacion redirect /', function () {
    expect(mylocation.path()).toEqual('/');
  });

  
});
