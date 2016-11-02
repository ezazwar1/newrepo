
(function () {
    'use strict';

    angular.module('shiptApp').controller('AddCustomProductToOrderController', [
        '$scope',
        '$rootScope',
        'ShoppingService',
        'AppAnalytics',
        AddCustomProductToOrderController]);

    function AddCustomProductToOrderController($scope,
                                     $rootScope,
                                     ShoppingService,
                                     AppAnalytics     ) {
        var viewModel = this;

        viewModel.cancelAddCustomProduct = function(){
            loadViewModelData();
            $rootScope.$broadcast('close.addCustomProduct');
        };

        viewModel.saveCustomProduct = function(){
            $rootScope.$broadcast('close.addCustomProduct', viewModel.customProduct);
            AppAnalytics.createSpecialRequest(viewModel.customProduct);
            loadViewModelData();
        };

        viewModel.subtractFromCustomItemCount = function(){
            if(viewModel.customProduct.qty != 1){
                viewModel.customProduct.qty = (viewModel.customProduct.qty - 1);
            }
        };

        viewModel.addToCustomItemCount = function(){
            viewModel.customProduct.qty = (viewModel.customProduct.qty + 1);
        };


        function loadViewModelData(){
            viewModel.customProduct = {
                isCustom: true,
                price: 0,
                qty:1
            };

            viewModel.title = "Special Request";
        }

        loadViewModelData();

    };
})();
