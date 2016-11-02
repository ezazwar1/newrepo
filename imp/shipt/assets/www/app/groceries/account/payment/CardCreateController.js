/**
 * Created by Shipt
 */



(function () {
    'use strict';

    angular.module('shiptApp').controller('CardCreateController', [
        '$scope',
        '$log',
        '$ionicHistory',
        '$stateParams',
        'AccountService',
        'UIUtil',
        '$rootScope',
        'LogService',
        'ErrorHandler',
        'AppAnalytics',
        CardCreateController]);

    function CardCreateController($scope,
                                $log,
                                $ionicHistory,
                                $stateParams,
                                AccountService,
                                UIUtil,
                                $rootScope,
                                  LogService,
                                  ErrorHandler,
                                  AppAnalytics) {

        $log.info('CardDetailController loaded');
        var addingNewCardMode = false;

        $scope.$on('$ionicView.beforeEnter', function(){
            $log.info('beforeEnter, state params: ', $stateParams.card);
            $scope.card = angular.fromJson($stateParams.card);
            if($scope.card == null){
                $scope.title = "Add Card";
                addingNewCardMode = true;
            } else {
                $scope.title = "Edit Card";
                addingNewCardMode = false;
            }
        });

        $scope.saveCard = function(card){
            UIUtil.showLoading();
            $log.info('saveCard click', card);
            AccountService.saveNewCard(card)
                .then(function(card){
                    AppAnalytics.addCard();
                    $log.info('success');
                    $rootScope.$broadcast('refresh.user-data');
                    $ionicHistory.goBack();
                    UIUtil.hideLoading();
                }, function(error){
                    LogService.error(error);
                    $rootScope.$broadcast('refresh.user-data');
                    ErrorHandler.displayStripeError(error, "Couldn't Save Card");
                    UIUtil.hideLoading();
                });
        };

    };
})();
