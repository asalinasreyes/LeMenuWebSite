'use strict';

angular.module('leMeNuApp')
    .controller('AdminListComplaintCtrl', function($scope, $translate, ListAllow, User, DashBoardInfo) {

        var lang = $translate.use();
        var listCountries = ListAllow.Countries[lang];
        var mapCountries = [];
        for (var i = listCountries.length - 1; i >= 0; i--) {
            mapCountries[listCountries[i].code] = listCountries[i].name;
        };

        DashBoardInfo.Complaints({}, function(listacomplaint) {
            $scope.listacomplaint = listacomplaint;
            for (var i = listacomplaint.length - 1; i >= 0; i--) {
                listacomplaint[i].nameCountry = mapCountries[listacomplaint[i].RestoCountry];
            };
            $scope.listacomplaint = listacomplaint;

        });

        $scope.getNameCountry = function(codeCountry) {
            return mapCountries[codeCountry];
        }

        $scope.getflagByCode = function(code) {
            return "flag-icon-" + code;
        };



        var options = {
            width: 300,
            height: 200
        };


        var frutas = {
            labels: ['apples', 'bananas', 'oranges'],
            series: [50, 25, 25]
        };


        var sum = function(a, b) {
            return a + b
        };

        new Chartist.Pie('.ct-chart', frutas, {
            labelInterpolationFnc: function(value,dos) {
                return value + ' ' + Math.round(frutas.series[dos] / frutas.series.reduce(sum) * 100) + '%';
            }
        });
        Chartist.Pie('.ct-frutas', frutas);




         $scope.chartObject = {};
    
    $scope.chartObject.type = "BarChart";
    
    $scope.onions = [
        {v: "Onions"},
        {v: 1000},
    ];

    $scope.chartObject.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
    ], "rows": [
        {c: [
            {v: "Mushrooms"},
            {v: 3},
        ]},
        {c: $scope.onions},
        {c: [
            {v: "Olives"},
            {v: 31}
        ]},
        {c: [
            {v: "Zucchini"},
            {v: 1},
        ]},
        {c: [
            {v: "Pepperoni"},
            {v: 2},
        ]}
    ]};

    $scope.chartObject.options = {
        'title': 'How Much Pizza I Ate Last Night'
    };

    });
