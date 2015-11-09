'use strict';

angular.module('leMeNuApp')
  .controller('NavbarTranslatorCtrl', function($scope, $location,$filter, tmhDynamicLocale,$translate, Auth, ListAllow) {

    $scope.languageEnable = {};
    $scope.LanguagesAllow = ListAllow.LanguagesAllow;
    $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, {
      code: $translate.use()
    })[0];
    tmhDynamicLocale.set($scope.languageEnable.locale);

    $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;


    $scope.ChangeLang = function(selectLanguage) {

      $translate.use(selectLanguage.code);

      $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, {
        code: selectLanguage.code
      })[0];
      $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;
      tmhDynamicLocale.set(selectLanguage.locale);
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