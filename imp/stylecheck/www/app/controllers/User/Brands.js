/*global define*/
define([
    'app',
    'services/api',
    'services/user',
    'services/browse',
    'services/grouplist',
    'services/gender',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('BrandsCtrl', [
        '$scope',
        '$rootScope',
        'apiService',
        'userService',
        'browseService',
        'groupList',
        'gender',
        'LoadingFactory',
        function ($scope, $rootScope, apiService, userService, browseService, groupList, gender, loadingFactory) {
            var brands = apiService.config.brands,
                userData,
                userGender,
                stateParams = browseService.params();

            if (stateParams.first) {
                $rootScope.first = true;
            }

            $scope.toggleSelection = function (brandName) {
                var idx = $scope.selection.indexOf(brandName);
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                } else {
                    $scope.selection.push(brandName);
                }
            };

            $scope.saveBrands = function () {
                userData.brands = $scope.selection;
                loadingFactory().then(function (loadingOverlay) {
                    userService.setAccount(userData).then(function () {
                        if (browseService.params().first) {
                            $rootScope.resetHistory();
                            browseService.go('base.dashboard').then(function () {
                                loadingOverlay.hide();
                                $rootScope.first = false;
                            }, function () {
                                loadingOverlay.hide();
                                $rootScope.first = false;
                            });

                        } else {
                            browseService.go('base.settings').then(loadingOverlay.hide, loadingOverlay.hide);
                        }
                    });
                });
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                userData = { 'brands': [] };
                userGender = userService.user.gender;
                $scope.selection = userService.user.brands;
                brands = gender.filterList(brands, userGender);
                brands = groupList.groupByInitialLetter(brands);
                $scope.brandList = brands;
            });
        }
    ]);
});
