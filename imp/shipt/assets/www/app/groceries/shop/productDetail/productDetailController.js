
(function () {
    'use strict';

    angular.module('shiptApp').controller('productDetailController', [
        '$scope',
        '$rootScope',
        'ShoppingService',
        'ShoppingCartService',
        '$ionicModal',
        '$log',
        '$state',
        '$filter',
        'AccountService',
        'ProductDetailProvider',
        'UIUtil',
        '$timeout',
        productDetailController]);

    function productDetailController($scope,
                                    $rootScope,
                                    ShoppingService,
                                    ShoppingCartService,
                                    $ionicModal,
                                    $log,
                                    $state,
                                    $filter,
                                    AccountService,
                                    ProductDetailProvider,
                                    UIUtil,
                                    $timeout) {
        var viewModel = this;

        viewModel.inCartText = function (product, count) {
          if(count > 1) {
            return product.description_label[product.description_label.length - 1];
          } else {
            return product.description_label[0];
          }
        };

        viewModel.clickCategory = function(category){
            $scope.closeProductDetail();
            $timeout(function () {
                $state.go('app.products', {category: angular.toJson(category)});
            }, 100);
        }

        viewModel.getDateString = function(date) {
            if (!date) return '';
            return moment(date).format("MMM Do");
        }

        viewModel.isOnSaleWithDates = function(product) {
            if(product && product.on_sale) {
                if(product.sale_starts_on && product.sale_ends_on) {
                    return true;
                }
                return false;
            }
            return false;
        }

        viewModel.getDetailModalPrice = function(product) {
            try {
                if (product.product_type == 'by weight') {
                    if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                        var unit_of_measure = "lb";
                    } else {
                        var unit_of_measure = product.unit_of_measure
                    }

                    return `${$filter('currency')(product.price)} per ${unit_of_measure}`
                } else {
                    return $filter('currency')(product.price);
                }
            } catch (e){
                return null
            }
        }

        viewModel.getSalePrice = function(product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure
            }

            if (product.product_type == 'by weight') {
                return `${$filter('currency')(product.sale_price)} per ${unit_of_measure}`
            } else {
                return $filter('currency')(product.sale_price);
            }
        }

    }
})();
