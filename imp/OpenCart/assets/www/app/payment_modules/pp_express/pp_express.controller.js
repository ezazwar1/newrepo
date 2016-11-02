'use strict';

angular
    .module('pp_express.module')
    .controller('PaymentPPExpressCtrl', function ($scope, $rootScope, $stateParams, $state, CartService, PaymentPPExpressService) {

        $scope.payment_initiated = false;

        $scope.pay = function () {
            $scope.payment_initiated = true;

            // add order into missing status
            $rootScope.paymentAndShipping['order_status_id'] = 0;

            CartService.AddOrder($rootScope.paymentAndShipping).then(function (data) {
                PaymentPPExpressService.OpenPaymetWindow().then(function (data) {
                    $state.go($scope.success_state, {}, { reload: true });
                    $ionicLoading.hide();
                    // set cart badge to empty
                    $rootScope.cartItemCount = "";
                }, function (data) {
                    alert(JSON.stringify(data));
                    $scope.payment_initiated = false;
                });
            });
        }
        
        $scope.$on('$ionicView.enter', function () {
            //$scope.checkout = $stateParams.checkout;
            //$scope.total_amount_clean = $stateParams.total_amount_clean;
            $scope.success_state = $stateParams.success_state;
            //$scope.order_id = $stateParams.order_id;
            //$scope.currency = $stateParams.currency;
            $scope.total_amount = $stateParams.total_amount;
            $scope.pay();
        });

    });