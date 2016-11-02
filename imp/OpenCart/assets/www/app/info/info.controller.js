'use strict';

/**
* @ngdoc controller
* @name info.module.controller:InfoCtrl
* @requires $scope
* @requires $rootScope
* @requires $state
* @requires $stateParams
* @requires $localStorage
* @requires notificationService
* @requires LANGUAGES
* 
* @description
* Shows the home page of info module. Contains user language switch which invokes a method
* defined in `rootScope`. Need to change `$scope.lanuages` variable if new languages are added or
* existing are removed.
*/
angular
    .module('info.module')
    .controller('InfoCtrl', function ($scope, $rootScope, $state, $stateParams, $localStorage, notificationService, LANGUAGES) {
        var vm = this;

        $scope.$on('$ionicView.enter', function () {

            $rootScope.$broadcast('i2csmobile.more');

            if ($stateParams.redirect) {
                $state.go("app.menu.info." + $stateParams.redirect);
                $stateParams.redirect = "";
            }
        });

        $scope.info = {};
        $localStorage.silent = $localStorage.silent || false;
        $scope.info.notifications = !$localStorage.silent;

        $scope.toggleNotifications = function () {
            if ($scope.info.notifications) {
                $localStorage.silent = false;
                notificationService.subscribeForPush();
            } else {
                $localStorage.silent = true;
                notificationService.unsubscribeFromPush();
            }
        }
    });

/**
* @ngdoc controller
* @name info.module.controller:InfoOrdersCtrl
* @requires $scope
* @requires $ionicLoading
* @requires InfoService
* @description
* Shows the list of past orders of a logged in customer.
*/
angular
    .module('info.module')
    .controller('InfoOrdersCtrl', function ($scope, $ionicLoading, InfoService) {
        var vm = this;

        $ionicLoading.show();
        InfoService.GetOrders().then(function (data) {
            $scope.orders = data.orders;
            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
        });

    });

/**
* @ngdoc controller
* @name info.module.controller:InfoLoadOrderCtrl
* @requires $scope
* @requires $ionicLoading
* @requires $stateParams
* @requires InfoService
* @description
* Shows information and invoice of an order.
*/
angular
    .module('info.module')
    .controller('InfoLoadOrderCtrl', function ($scope, $ionicLoading, $stateParams, InfoService) {
        var vm = this;

        $ionicLoading.show();
        InfoService.GetOrder($stateParams.id).then(function (data) {
            $scope.products = data.products;
            $scope.totals = data.totals;

            $scope.invoice_no = data.invoice_no;
            $scope.order_id = data.order_id;
            $scope.date_added = data.date_added;
            $scope.shipping_address = data.shipping_address;
            $scope.shipping_method = data.shipping_method;

            $scope.histories = data.histories;

            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
        });
    });

/**
* @ngdoc controller
* @name shop.module.controller:InfoWishlistCtrl
* @requires $scope
* @requires $state
* @requires $ionicLoading
* @requires $ionicTabsDelegate
* @requires InfoService
* @description
* Display current wishlist.
*/
angular
    .module('info.module')
    .controller('InfoWishlistCtrl', function ($scope, $state, $ionicLoading, $ionicTabsDelegate, InfoService) {

        $scope.loadWishlist = function () {
            $ionicLoading.show();
            InfoService.GetWishlist().then(function (data) {
                $scope.items = data.products;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.refreshUI = function () {
            $scope.loadWishlist();
        }

        $scope.goToShop = function () {
            $ionicTabsDelegate.select(0);
        }

        $scope.removeItem = function (id) {
            $ionicLoading.show();
            InfoService.RemoveFromWishlist(id).then(function (data) {
                $scope.loadWishlist();
            }, function (data) {
                $scope.loadWishlist();
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.loadWishlist();
        });
    });