'use strict';

angular.module('leMeNuApp')
  .controller('NavbarCtrl', function ($scope, $location, $translate, $filter,tmhDynamicLocale, Auth, ListAllow) {
    $scope.menu = [{
      'title': 'navbar.lhome',
      'link': '/'
    }];

    $scope.languageEnable={};
    $scope.LanguagesAllow = ListAllow.LanguagesAllow;
    $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, { code: $translate.use() })[0];
    tmhDynamicLocale.set($scope.languageEnable.locale);

    $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.ChangeLang = function(selectLanguage) {
      
      $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, { code: selectLanguage.code })[0];
     $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;
      $translate.use(selectLanguage.code);  
      tmhDynamicLocale.set(selectLanguage.locale);
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });