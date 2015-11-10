'use strict';

angular.module('leMeNuApp')
    .controller('NavbarCtrl', function($scope, $location, $translate, $filter, tmhDynamicLocale, Auth, ListAllow, $window) {
        $scope.languageEnable = {};
        $scope.LanguagesAllow = ListAllow.LanguagesAllow;
        $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, {
            code: $translate.use()
        })[0];
        tmhDynamicLocale.set($scope.languageEnable.locale);

        $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;
        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isTranlator = Auth.isTranlator;
        $scope.isOwner = Auth.isOwner;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $scope.logout = function() {
            Auth.logout();
            $location.path('/login');
        };

        $scope.ChangeLang = function(selectLanguage) {

            $scope.languageEnable = $filter('filter')(ListAllow.LanguagesAllow, {
                code: selectLanguage.code
            })[0];

            
            $scope.getcssFlag = 'flag-icon-' + $scope.languageEnable.flag;
            tmhDynamicLocale.set(selectLanguage.locale);

            $translate.use(selectLanguage.code);

            //$window.location.reload();
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
