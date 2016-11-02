'use strict';

angular
    .module('advertikon_stripe.module')
    .controller('PaymentStripeCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, CartService, PaymentStripeService, StripeCheckout) {

        var handler = null;

        $ionicLoading.show();
        var email = $stateParams.checkout ? $stateParams.checkout.email : "";
        PaymentStripeService.GetPublicKey().then(function (data) {
            handler = StripeCheckout.configure({
                key: data.public_key,
                name: "i2CS",
                image: "img/logo.png",
                email: email
            });
            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
            alert(data);
        });

        $scope.$on('$ionicView.enter', function () {
            $scope.checkout = $stateParams.checkout;
            $scope.total_amount_clean = $stateParams.total_amount_clean;
            $scope.success_state = $stateParams.success_state;
            //$scope.order_id = $stateParams.order_id;
            $scope.currency = $stateParams.currency;
            $scope.total_amount = $stateParams.total_amount;
            var description = "Order for " + $scope.checkout.firstname;

            $scope.doCheckout = function (token, args) {
                var options = {
                    description: description,
                    amount: $scope.total_amount_clean * 100,
                    alipay: true,
                    currency: $scope.currency
                };

                if (handler) {
                    handler.open(options)
                      .then(function (result) {
                          $ionicLoading.show();
                          placeOrderOnSuccessReturn(result);
                      }, function () {
                          alert("Please make the payment to confirm the order");
                      });
                }
            };
        });

        var placeOrderOnSuccessReturn = function (result) {
            $ionicLoading.show();

            CartService.AddOrder($rootScope.paymentAndShipping).then(function (data) {
                $ionicLoading.hide();
                // set cart badge to empty
                $rootScope.cartItemCount = "";
                $ionicLoading.show();

                PaymentStripeService.MakePayment({ stripe_token: result[0].id, order_id: data.order_id, currency: $scope.currency, last4: result[0].card.last4, amount: $scope.total_amount_clean * 100 }).then(function (data) {
                    $ionicLoading.hide();
                    $state.go($scope.success_state, {}, { reload: true });
                }, function (data) {
                    $ionicLoading.hide();
                    alert("Error. " + data);
                });
            });
        }
    });