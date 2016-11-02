/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('accountController', [
        '$scope',
        '$rootScope',
        '$state',
        'UIUtil',
        '$log',
        'AccountService',
        'common',
        'Subscription',
        'ErrorHandler',
        'planProvider',
        'FeatureService',
        accountController]);

    function accountController($scope,
                               $rootScope,
                               $state,
                               UIUtil,
                               $log,
                               AccountService,
                               common,
                               Subscription,
                               ErrorHandler,
                               planProvider,
                               FeatureService) {
        var vm = this;
        $scope.loadingIndicator = false;

        $scope.customerInfo = {
            phone: null,
            email: null,
            name: null,
            metro_id: null
        };

        $scope.editAccount = function() {
            if($scope.loadingIndicator) return;
            var account = {
                name:$scope.customerInfo.name,
                email: $scope.customerInfo.email,
                phone: $scope.customerInfo.phone,
                metro_id: $scope.customerInfo.metro_id
            };
            $state.go('app.editAccount', {account: angular.toJson(account)});
        };

        $scope.showSubscribeButton = function() {
            if(webVersion && $scope.customerInfo.guest_account) {
                return true;
            }
            return false;
        }

        $scope.guest_account = function(){
            return AccountService.isCustomerGuest();
        };

        vm.planPrice = function(plan){
            var amount =  plan.amount / 100;
            return amount;
        }

        vm.subscriptionClick = function() {
            $log.info('subscriptionClick');
            planProvider.showModal($scope, vm.plan)
                .then(function(){
                    loadData();
                },function(){

                });
        };

        function loadData(){
            try {
                showLoading();
                if(FeatureService.subscription()){
                    $scope.planPromise = Subscription.edit();
                    $scope.planPromise.then(function(data){
                        vm.plan = data;
                        vm.planLoaded = true;
                    },function(error){
                        $log.error('error loading plan', error);
                    });
                } else {
                    vm.plan = undefined;
                    vm.planLoaded = true;
                }

                AccountService.refreshCustomerInfoShort()
                    .then(function(data){
                        $scope.customerInfo = data;
                        hideLoading();
                    },function(error){
                        hideLoading();
                    });
            } catch (exception) {
                UIUtil.hideLoading();
                $log.error(exception);
            }
        }

        function showLoading(){
            $scope.loadingIndicator = true;
        }

        function hideLoading() {
            $scope.loadingIndicator = false;
        }

        $scope.$on('$ionicView.beforeEnter', function(){
            loadData();
        });

        $scope.signoutClick = function(){
            common.logoutCurrentUser();
        };

        $scope.$on('user.loggedin', function (event, data) {
            $log.info('user.loggedin');
            loadData();
        });

        $rootScope.$on('refresh.user-data', function(event,data){
            $log.info('refresh.user-data');
            loadData();
        });

        $scope.$on('user.registered', function (event, data) {
            $log.info('user.registered');
            loadData();
        });

    };
})();
