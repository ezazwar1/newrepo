/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('EditAccountController', [
        '$scope',
        '$log',
        '$rootScope',
        '$ionicHistory',
        '$stateParams',
        'AccountService',
        'UIUtil',
        'LogService',
        'AuthService',
        'ShoppingCartService',
        'AppAnalytics',
        'ErrorHandler',
        EditAccountController]);

    function EditAccountController($scope,
                                   $log,
                                   $rootScope,
                                   $ionicHistory,
                                   $stateParams,
                                   AccountService,
                                   UIUtil,
                                   LogService,
                                   AuthService,
                                   ShoppingCartService,
                                   AppAnalytics,
                                   ErrorHandler) {

        var viewModel = this;

        $scope.$on('$ionicView.beforeEnter', function(){
            $log.info('beforeEnter, state params: ', $stateParams.account);
            viewModel.account = angular.fromJson($stateParams.account);
        });

        function clearStuffForMetroChange() {
            try {
                ShoppingCartService.clearCart();
                localStorage.removeItem('localCategories');
            } catch (e) {

            }
        }

        viewModel.saveAccount = function() {
            var resetCache = false;
            UIUtil.showLoading();
            saveUpdatedAccount();
        };

        function saveUpdatedAccount(){
            AccountService.updateAccountInfo(viewModel.account)
                .success(function(data) {
                    $rootScope.$broadcast('refresh.user-data');
                    UIUtil.hideLoading();
                    $ionicHistory.goBack();
                    AppAnalytics.updateUser();
                })
                .error(function(error){
                    UIUtil.hideLoading();
                    LogService.error(error);
                    ErrorHandler.displayShiptAPIError(error);
                });
        }
    }
})();
