'use strict';

angular.module('leMeNuApp')
    .directive('disableAnimation', function($animate) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                $attrs.$observe('disableAnimation', function(value) {
                    $animate.enabled(!value, $element);
                });
            }
        }
    })


.controller('MainCtrl', function($scope, $translate) {

    var lang = $translate.use() || 'es';
    var pathAssets = '/assets/images/staticname/home/';
    $scope.myInterval = 8000;
    $scope.noWrapSlides = true;
    $scope.slides = [{
        image: pathAssets + '01LogoFull2.png',
        text: 'home.header1'
    }, {
        image: pathAssets + '02.gif',
        text: 'home.header1'
    },{
        image: pathAssets + lang + '/03.gif',
        text: 'home.header1'
    }];


});