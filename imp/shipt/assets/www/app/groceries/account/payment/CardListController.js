/**
 * Created by patrick on 2/24/15.
 */



(function () {
    'use strict';

    angular.module('shiptApp').controller('CardListController', [
        '$scope',
        '$state',
        '$log',
        'AccountService',
        'UIUtil',
        'ErrorHandler',
        'createPaymentMethodModal',
        CardListController]);

    function CardListController($scope,
                                   $state,
                                   $log,
                                   AccountService,
                                   UIUtil,
                                   ErrorHandler,
                                   createPaymentMethodModal) {

        $scope.title = "Cards";
        $log.info('CardListController loaded');


        function loadData(){
            showLoading();
            AccountService.getCardsFromServer()
                .then(function(data){
                    var customerInfo = data;
                    $scope.cards =  customerInfo.credit_cards;
                    hideLoading();
                },function(error){
                    hideLoading();
                });
        }

        function showLoading() {
            $scope.showLoading = true;
        }

        function hideLoading() {
            $scope.showLoading = false;
        }

        $scope.$on('$ionicView.afterEnter', function() {
            loadData();
        });

        $scope.editCard = function(card){
            $log.info('editCard click', card);
            $state.go('app.existingCardDetails', {card: angular.toJson(card)});
        };

        $scope.addNewCard = function() {
            $log.info('addNewCard click');
            // $state.go('app.addEditCard', {card: angular.toJson(null)});
            createPaymentMethodModal.showModal($scope)
                .then(function(newCard){
                    loadData();
                },function(error){
                    //canceled the payment modal
                })
        };

        $scope.deleteCard = function(card){
            UIUtil.showConfirm('Delete Credit Card', 'Are you sure you want to delete this credit card?')
                .then(function(confirmed){
                    if(confirmed) {
                        UIUtil.showLoading();
                        $log.info('deleteCard click', card);
                        AccountService.deleteCard(card)
                            .then(function (card) {
                                $log.info('success');
                                UIUtil.hideLoading();
                                loadData();
                            }, function (error) {
                                $log.error('error');
                                ErrorHandler.displayShiptAPIError(error,'There was an error deleting the card.');
                                UIUtil.hideLoading();
                            });
                    }
                });
        };

    };
})();
