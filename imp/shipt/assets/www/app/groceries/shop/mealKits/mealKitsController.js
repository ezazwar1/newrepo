
/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('mealKitsController', [
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
        mealKitsController]);

    function mealKitsController($scope,
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

        vm.goToCart = function() {
            $state.go('app.shoppingCart');
        };

        vm.guest_account = function() {
            return AccountService.isCustomerGuest()
        };

        vm.cartCount = function(){
            return ShoppingService.getCartItemCount();
        };

        vm.loadData = function() {
            var mealKit = angular.fromJson($stateParams.mealKit);
            vm.mealKit = mealKit;
        };

        vm.mealKitClick = function(mealKit) {
            $state.go('app.mealKitDetail',{mealKit: angular.toJson(mealKit)});
        };

        vm.doRefresh = function(){
            vm.loadData();
        };

        vm.loadData = function() {
            MealKits.getMealKits()
                .then(function(mealKits){
                    $log.info('mealKits', mealKits);
                    vm.mealKits = mealKits;
                },function(error){
                    $log.error(error);
                });
        };

        vm.loadData();

    }
})();
