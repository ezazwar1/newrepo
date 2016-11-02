/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('mealKitDetailController', [
        '$scope',
        '$ionicModal',
        '$state',
        '$stateParams',
        'ShoppingService',
        '$log',
        'UIUtil',
        '$timeout',
        '$cordovaKeyboard',
        'LogService',
        '$ionicSlideBoxDelegate',
        'AccountService',
        'MealKits',
        '$filter',
        mealKitDetailController]);

    function mealKitDetailController($scope,
                                $ionicModal,
                                $state,
                                $stateParams,
                                ShoppingService,
                                $log,
                                UIUtil,
                                $timeout,
                                $cordovaKeyboard,
                                LogService,
                                $ionicSlideBoxDelegate,
                                AccountService,
                                MealKits,
                                $filter) {

        var vm = this;

        var displayServingIndex = 0;
        vm.cartMealKit = null;

        vm.goToCart = function() {
            $state.go('app.shoppingCart');
        };

        vm.guest_account = function() {
            return AccountService.isCustomerGuest()
        };

        vm.cartCount = function(){
            return ShoppingService.getCartItemCount();
        };

        vm.clickBuyMealKitButton = function() {
            vm.cartMealKit = vm.mealKit;
            vm.cartMealKit.serving = vm.displayServingGet();
        };

        vm.buyButtonText = function() {
            //if in cart and selected serving is the same as what is in cart
            if (vm.cartMealKit && vm.displayServingGet() == vm.cartMealKit.serving) {
                return "In Cart";
            }
            //if in cart but serving is different
            if (vm.cartMealKit && vm.displayServingGet() != vm.cartMealKit.serving) {
                return "Update Quantity";
            }
            //else if nothign is in the cart
            return "Add to Cart";
        };

        vm.buyServingButtonText = function(serving) {
            //if in cart and selected serving is the same as what is in cart
            if (vm.cartMealKit && vm.cartMealKit.serving == serving) {
                return "In Cart";
            }
            //if in cart but serving is different
            if (vm.cartMealKit && vm.cartMealKit.serving != serving) {
                return "Update Quantity";
            }
            //else if nothign is in the cart
            return "Add to Cart";
        }

        vm.displayMinus = function() {
            if( displayServingIndex > 0 ) {
                return true;
            } else if (displayServingIndex == vm.mealKit.servings.length) {
                return false
            }
        };

        vm.buyServingButton = function(serving) {
            if(vm.cartMealKit && vm.cartMealKit.serving == serving){
                vm.cartMealKit = null;
            } else {
                vm.cartMealKit = vm.mealKit;
                vm.cartMealKit.serving = serving;
                MealKits.addMealKitToCart(vm.cartMealKit);
            }
        };

        vm.displayPlus = function() {
            return vm.mealKit.servings.length > displayServingIndex + 1;
        };

        vm.minusMealKit = function() {
            displayServingIndex --;
        };

        vm.plusMealKit = function() {
            displayServingIndex ++;
        };

        vm.displayServingGet = function() {
            console.log('meal kit',vm.mealKit);
            return vm.mealKit.servings[displayServingIndex];
        };

        vm.loadData = function() {
            var mealKit = angular.fromJson($stateParams.mealKit);
            vm.mealKit = mealKit;

            if(vm.cartMealKit){

            } else {
                displayServingIndex = 0;
            }

        };

        vm.loadData();

    }
})();
