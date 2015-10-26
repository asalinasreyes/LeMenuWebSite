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
    .controller('MainCtrl', function($scope) {
        $scope.myInterval = 5000;
        var path = '/assets/images/staticname/';
        $scope.slides = [{
            image:path+'Menu_1.jpg',
            header:'hadsfsdafasdf'
        },{
            image: path+'Menu_2.jpg',
            header:'ad fasdf'
        },{
             image:path+'Menu_3.jpg',
             header:'asd fsadfadfasdf  asd'
        }];
    });
