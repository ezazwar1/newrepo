
(function () {
    'use strict';

    angular.module('shiptApp').controller('createPaymentMethodModalController', [
        '$scope',
        '$timeout',
        '$rootScope',
        'LogService',
        'AccountService',
        'UIUtil',
        '$log',
        'ErrorHandler',
        'AppAnalytics',
        createPaymentMethodModalController]);

    function createPaymentMethodModalController($scope,
                                              $timeout,
                                              $rootScope,
                                              LogService,
                                              AccountService,
                                              UIUtil,
                                              $log,
                                              ErrorHandler,
                                              AppAnalytics) {
        var vm = this;
        vm.card = null;

        vm.saveCard = function(card){
            card = vm.card;
            UIUtil.showLoading('Saving Card...');
            $log.info('saveCard click', card);
            AccountService.saveNewCard(card)
                .then(function(card){
                    AppAnalytics.addCard();
                    $log.info('success');
                    $rootScope.$broadcast('refresh.user-data');
                    UIUtil.hideLoading();
                    vm.saveCardModal();
                }, function(error){
                    LogService.error(error);
                    $rootScope.$broadcast('refresh.user-data');
                    ErrorHandler.displayStripeError(error, "Couldn't Save Card");
                    UIUtil.hideLoading();
                });
        };

        vm.cancel = function(){
            $scope.closeCardModal();
        };

        vm.saveCardModal = function(window){
            $timeout(function(){
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                $scope.closeCardModal(vm.card);
            },200);
        };

        function loadData(){
        }

        loadData();
    }
})();
