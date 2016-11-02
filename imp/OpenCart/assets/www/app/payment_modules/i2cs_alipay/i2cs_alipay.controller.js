'use strict';

angular
    .module('i2cs_alipay.module')
    .controller('PaymentAlipayCtrl', function ($scope, $rootScope, $stateParams, $state, CartService, PaymentAlipayService) {

        $scope.payment_initiated = false;

        $scope.pay = function () {
            $scope.payment_initiated = true;
            PaymentAlipayService.OpenPaymetWindow($scope.order_id).then(function (data) {
                placeOrderOnSuccessReturn();
            }, function (data) {
                alert(JSON.stringify(data));
                $scope.payment_initiated = false;
            });
        }
        
        $scope.$on('$ionicView.enter', function () {
            //$scope.checkout = $stateParams.checkout;
            //$scope.total_amount_clean = $stateParams.total_amount_clean;
            $scope.success_state = $stateParams.success_state;
            $scope.order_id = $stateParams.order_id;
            //$scope.currency = $stateParams.currency;
            $scope.total_amount = $stateParams.total_amount;

            $scope.pay();
        });

        var placeOrderOnSuccessReturn = function () {
            $ionicLoading.show();

            CartService.AddOrder($rootScope.paymentAndShipping).then(function (data) {
                $ionicLoading.hide();
                // set cart badge to empty
                $rootScope.cartItemCount = "";
                $state.go($scope.success_state, {}, { reload: true });
            });
        }
    });