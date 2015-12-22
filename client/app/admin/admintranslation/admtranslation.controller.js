'use strict';

angular.module('leMeNuApp')
    .controller('admtranslationCtrl', function($scope, DashBoardInfo, $uibModal, $translate, ListAllow) {
        $scope.CreatedFiles = [];

        var lang = $translate.use();
        var listCountries = ListAllow.Countries[lang];
        var mapCountries = [];
        for (var i = listCountries.length - 1; i >= 0; i--) {
            mapCountries[listCountries[i].code] = listCountries[i].name;
        };



        DashBoardInfo.GetListTranslations({}, function(data) {
            $scope.ListTranslation = data;
        });

        $scope.showComplaint = function(complaint) {
            var modalInstance = $uibModal.open({
                templateUrl: 'OwnerViewcomplaint.html',
                controller: 'ModalInstanceMOwnerComplaintCtrl',
                resolve: {
                    complaintDetail: function() {
                        return complaint;
                    }
                }
            });
        };



        $scope.getflagByID = function(lang){
            return "flag-icon-"+lang._id;
        };

        $scope.getflagByCode = function(code){
            return "flag-icon-"+code;
        };
        
        $scope.getNameCountry = function(codeCountry) {
            return mapCountries[codeCountry];
        };

        $scope.showOptionsEndTranslation = function(translate) {
            var showoption = false;
            if (translate.EndTranslate && translate.StartTranslate) {
                showoption = true;
            }
            return showoption;
        };

        $scope.viewTranslation = function(restoInfo) {
            var queryParams = {
                queuedID: restoInfo._id,
                Restaurantid: restoInfo.Restaurantid._id,
                LanguagesTo: restoInfo.LanguagesTo
            };
            DashBoardInfo.viewTranslation(queryParams,
                function success(data) {
                    $scope.viewMenu = data;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'viewMenu.html',
                        controller: 'ModalInstanceViewMenuCtrl',
                        resolve: {
                            items: function() {
                                return data;
                            },
                            language: function() {
                                return restoInfo.LanguagesTo;
                            }
                        }
                    });
                },
                function err(err) {});
        };
    });
