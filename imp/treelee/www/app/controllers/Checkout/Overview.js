/*global define, google, navigator*/
define([
    'angular',
    'app',
    'services/checkout',
    'services/browse',
    'services/cart',
    'factories/loading',
    'factories/modal',
    'factories/popup'
], function (angular, app) {

    'use strict';

    app.controller('OverviewCtrl', [
        '$ionicNavBarDelegate',
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$ionicScrollDelegate',
        'checkoutService',
        'browseService',
        'cartService',
        'LoadingFactory',
        'ModalFactory',
        'PopupFactory',
        function ($ionicNavBarDelegate, $scope, $rootScope, $window, $timeout, $ionicScrollDelegate, checkoutService, browseService, cartService, LoadingFactory, ModalFactory, PopupFactory) {
            var loading = new LoadingFactory(),
                agreementModal = new ModalFactory($scope, 'agreement.html');

            $scope.agreements = {};

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

            loading.then(function (loadingOverlay) {
                checkoutService.orderReview().then(function (order) {
                    var i = 0;
                    $scope.order = order;
                    for (i; i < order.agreements.length; i = i + 1) {
                        $scope.agreements[order.agreements[i].code] = 'false';
                    }
                    $scope.agreements['payment[method]'] = order.payment.code;
                    loadingOverlay.hide();
                }, function () {
                    loadingOverlay.hide();
                });
            });

            $scope.buy = function () {
                var loading,
                    key,
                    agreed = true;

                for (key in $scope.agreements) {
                    if ($scope.agreements.hasOwnProperty(key) && $scope.agreements[key] === 'false') {
                        agreed = false;
                        break;
                    }
                }

                if (agreed) {
                    loading = new LoadingFactory();
                    loading.then(function (loadingOverlay) {
                        cartService.getInfo().then(function (cartInfo) {
                            // check if there is still a valid cart
                            if (!cartInfo.summary_qty || cartInfo.summary_qty === '0') {
                                browseService.navigate('/start');
                            } else {

                                checkoutService.saveOrder($scope.agreements).then(function (res) {

                                    if ($scope.order.payment && $scope.order.payment.start_url) {

                                        var externalPaymentWindow = $window.open($scope.order.payment.start_url, '_blank', 'location=yes,enableViewportScale=yes');

                                        //hide overlay, in case payment process fails and never reaches cancel or success
                                        loadingOverlay.hide();

                                        // listen to page load events
                                        externalPaymentWindow.addEventListener('loadstart', function (event) {
                                            var url = event.url;
                                            if (url.indexOf($scope.order.payment.cancel_url) !== -1 || url.indexOf($scope.order.payment.success_url) !== -1) {
                                                externalPaymentWindow.close();
                                            } else if ((url.indexOf($scope.order.payment.start_url) === -1) && (url.indexOf('live.treelee.com') !== -1)) {
                                                //wrong redirect
                                                externalPaymentWindow.close();
                                                $scope.info = {
                                                    'class': 'energized',
                                                    'msg': $rootScope.dict.error.payment_redirect //err.text
                                                };
                                            }
                                        });
                                    }

                                    // inform parent scopes, over cart changes -> order created -> cart = empty
                                    $scope.$emit('cartChanged');
                                    $rootScope.finished = true;
                                    $rootScope.finishedResponse = res;
                                    $scope.info = undefined;
                                    loadingOverlay.hide();
                                    browseService.navigate('/start');
                                }, function () {
                                    loadingOverlay.hide();
                                    $scope.info = {
                                        'class': 'energized',
                                        'msg': $rootScope.dict.error.quantity_not_available //err.text
                                    };
                                });

                            }
                        });

                    }, function () {
                        loadingOverlay.hide();
                        $scope.$emit('cartChanged');
                        browseService.navigate('/start');
                    });
                }
            };

            // modal is initialized
            agreementModal.then(function (modal) {
                $scope.showAgreement = function (index) {
                    $scope.agreement = undefined;

                    if ($scope.order.agreements[index]) {
                        if ($window.cordova && ionic.Platform.isIOS()) {
                            StatusBar.styleDefault();
                        }

                        $scope.agreement = $scope.order.agreements[index];

                        modal.show();
                    }
                };

                $scope.closeModal = function () {
                    modal.hide().then(function () {
                        if ($window.cordova && ionic.Platform.isIOS()) {
                            StatusBar.styleLightContent();
                        }

                        $scope.agreement = undefined;
                        $ionicScrollDelegate.resize();
                    });
                };
            });
        }
    ]);
});
