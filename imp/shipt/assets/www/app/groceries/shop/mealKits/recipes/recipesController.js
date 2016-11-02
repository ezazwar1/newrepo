/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('recipesController', [
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
        recipesController]);

    function recipesController($scope,
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

        var viewModel = this;

        $scope.goToCart = function() {
            $state.go('app.shoppingCart');
        };

        viewModel.loadData = function() {
            var mealKit = angular.fromJson($stateParams.mealKit);
            viewModel.mealKit = mealKit;
        };

        viewModel.clickBuyMealKitButton = function() {
            $log.info('clickBuyMealKitButton');
            viewModel.mealKit.inCart = true;
        };

        viewModel.subMealKit = function() {
            viewModel.mealKit.inCart = false;
        }

        viewModel.loadData();

    }
})();
