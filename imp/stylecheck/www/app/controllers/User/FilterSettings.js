/*global define*/
define([
    'app',
    'services/user',
    'services/browse',
    'factories/storage',
    'factories/popup',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('FilterSettingsCtrl', [
        '$scope',
        '$rootScope',
        'userService',
        'browseService',
        'StorageFactory',
        'PopupFactory',
        'LoadingFactory',
        function ($scope, $rootScope, userService, browseService, StorageFactory, popupFactory, loadingFactory) {
            var stateParams;
            $scope.form = {};

            $scope.$on('$ionicView.beforeEnter', function () {
                stateParams = browseService.params();

                if (stateParams.first) {
                    $scope.showHint = true;
                    popupFactory({
                        title: $rootScope.dict.shortStop,
                        template: $rootScope.dict.firstVisit,
                        buttons: [{
                            text: $rootScope.dict.ok,
                            type: 'button-assertive'
                        }]
                    });
                } else {
                    $scope.showHint = false;
                }

                $scope.userPrefs = {
                    minAge: userService.user.minAge || 16,
                    maxAge: userService.user.maxAge || 38,
                    ratingGender: userService.user.ratingGender || 'both'
                };

                $scope.ages = [$scope.userPrefs.minAge, $scope.userPrefs.maxAge];

                $scope.slider = {
                    value: $scope.userPrefs.minAge + ';' + $scope.userPrefs.maxAge,
                    options: {
                        from: 14,
                        to: 60,
                        step: 1,
                        realtime: true,
                        threshold: 4
                    }
                };
            });

            $scope.getValue = function () {
                $scope.ages = $scope.slider.value.split(';');
            };

            $scope.save = function () {
                $scope.userPrefs.minAge = parseInt($scope.ages[0], 10);
                $scope.userPrefs.maxAge = parseInt($scope.ages[1], 10);
                loadingFactory().then(function (loadingOverlay) {
                    userService.setAccount($scope.userPrefs).then(function () {
                        if (stateParams.first === 'feed' && $scope.showHint) {
                            $rootScope.resetHistory();
                            browseService.go('base.fashionFeed.overview').then(loadingOverlay.hide, loadingOverlay.hide);
                            StorageFactory.add({feedVisited: true});
                        } else if (stateParams.first === 'discover' && $scope.showHint) {
                            $rootScope.resetHistory();
                            browseService.go('base.styleDiscover.detail').then(loadingOverlay.hide, loadingOverlay.hide);
                            StorageFactory.add({discoverVisited: true});
                        } else {
                            browseService.go('base.settings').then(loadingOverlay.hide, loadingOverlay.hide);
                            StorageFactory.add({discoverVisited: true});
                        }
                    });
                });
            };
        }
    ]);
});
