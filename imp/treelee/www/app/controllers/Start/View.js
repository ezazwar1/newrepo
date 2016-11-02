/*global define, google, navigator*/
define([
    'app',
    'services/catalog',
    'services/browse',
    'factories/popup'
], function (app) {

    'use strict';

    app.controller('ViewCtrl', [
        '$scope',
        '$rootScope',
        '$ionicViewService',
        '$ionicSideMenuDelegate',
        'PopupFactory',
        function ($scope, $rootScope, $ionicViewService, $ionicSideMenuDelegate, PopupFactory) {
            // clear ionic history for animations if you are on startpage
            $ionicViewService.clearHistory();

            $scope.$watch(function () {
                return $rootScope.finished;
            }, function (orderFinished) {
                if (orderFinished) {
                    $rootScope.finished = false;
                    if ($rootScope.finishedResponse && $rootScope.finishedResponse.order_id) {
                        return new PopupFactory({
                            title: $rootScope.dict.thanks,
                            template: $rootScope.dict.orderNo + $rootScope.finishedResponse.order_id + $rootScope.dict.confirmation,
                            buttons : [{
                                type: 'button-energized',
                                text: $rootScope.dict.OK
                            }]
                        }, 'show');
                    }
                }
            });

            $scope.openMenu = function (event, categoryId) {
                if (!$ionicSideMenuDelegate.isOpenLeft()) {
                    $ionicSideMenuDelegate.toggleLeft();
                }

                $scope.showCategory(event, categoryId, '2');
            };
        }
    ]);
});
