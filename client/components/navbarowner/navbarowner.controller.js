'use strict';

angular.module('leMeNuApp')
  .controller('NavbarOwnerCtrl', function($scope, $location,$filter,$translate, Auth, ListAllow) {
    $scope.menu = [{
      'title': 'navbarowner.lhome',
      'link': '/'
    }];

    $scope.languageEnable = {};
    $scope.LanguagesAllow = ListAllow.LanguagesAllow;
    $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, {
      code: $translate.use()
    })[0];

    $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;


    $scope.ChangeLang = function(selectLanguage) {

      $translate.use(selectLanguage.code);

      $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, {
        code: selectLanguage.code
      })[0];
      $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;
    };

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isAdmin = Auth.isAdmin;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });