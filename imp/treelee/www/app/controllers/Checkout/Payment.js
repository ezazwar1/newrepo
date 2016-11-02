/*global define, google, navigator*/
define([
    'angular',
    'app',
    'services/checkout',
    'services/browse',
    'factories/loading',
    'factories/popup'
], function (angular, app) {

    'use strict';

    app.controller('PaymentCtrl', [
        '$ionicNavBarDelegate',
        '$scope',
        '$rootScope',
        'checkoutService',
        'browseService',
        'LoadingFactory',
        'PopupFactory',
        function ($ionicNavBarDelegate, $scope, $rootScope, checkoutService, browseService, LoadingFactory, PopupFactory) {
            var loading;

            $scope.payment = {};

            $scope.goBack = function () {
                $ionicNavBarDelegate.back();
            };

            $scope.$watch('info', function (info) {
                if (info && !angular.equals(info, {})) {
                    return new PopupFactory({
                        title: $rootScope.dict.error.title,
                        template: info.msg,
                        buttons : [{
                            type: 'button-energized',
                            text: $rootScope.dict.OK
                        }]
                    }, 'show');
                }
            });

            if (checkoutService.checkout.payment) {
                $scope.payment.method = checkoutService.checkout.payment;
            }

            if (checkoutService.checkout.payments) {
                $scope.payments = checkoutService.checkout.payments;
            } else {
                loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    checkoutService.payments().then(function (payments) {
                        $scope.payments = payments;
                        loadingOverlay.hide();
                    }, loadingOverlay.hide);
                });
            }

            $scope.savePayment = function () {
                var loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    checkoutService.savePayment({
                        'payment[method]': $scope.payment.method
                    }).then(function () {
                        loadingOverlay.hide();
                        $scope.info = undefined;
                        browseService.navigate('checkout/overview');
                    }, function (err) {
                        loadingOverlay.hide();
                        $scope.info = {
                            'class': 'assertive',
                            'msg': err.text
                        };
                    });
                });
            };
        }
    ]);
});
