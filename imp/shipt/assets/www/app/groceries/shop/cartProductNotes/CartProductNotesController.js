/**
 * Created by Shipt
 */


(function () {
    'use strict';

    angular.module('shiptApp').controller('CartProductNotesController', [
        '$scope',
        '$rootScope',
        CartProductNotesController]);

    function CartProductNotesController($scope,
                                     $rootScope) {
        var viewModel = this;

        viewModel.orderNotes = false;
        viewModel.placeholder = "Instructions from you to the shopper about this product.";
        viewModel.noteCartItem = {
            note: ""
        };

        viewModel.cancelNotes = function(){
            if(viewModel.orderNotes) {
                $rootScope.$broadcast('cancel.orderNotes');
            } else {
                $rootScope.$broadcast('cancel.productNotes');
            }
        };

        viewModel.saveNotes = function(){
            if(viewModel.orderNotes) {
                $rootScope.$broadcast('close.orderNotes', viewModel.noteCartItem.note);
            } else {
                $rootScope.$broadcast('close.productNotes', viewModel.noteCartItem.note);
            }
        };

        viewModel.addToCustomItemCount = function(){
            viewModel.customProduct.qty = (viewModel.customProduct.qty + 1);
        };

        $scope.$on('data.productNotes',function(event, data){
            if(data && (data.title || data.notes)) {
                viewModel.title = data.title;
                viewModel.noteCartItem.note = data.notes;
                viewModel.orderNotes = true;
                viewModel.placeholder = "Instructions from you to the shopper.";
            } else {
                viewModel.title = "Product Notes";
                viewModel.noteCartItem.note = data;
            }

        });

    };
})();


