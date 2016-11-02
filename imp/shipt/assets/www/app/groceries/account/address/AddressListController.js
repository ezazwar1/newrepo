/**
 * Created by patrick on 2/24/15.
 */


(function () {
    'use strict';

    angular.module('shiptApp').controller('AddressListController', [
        '$scope',
        '$state',
        '$log',
        'UIUtil',
        'AccountService',
        'ErrorHandler',
        'AppAnalytics',
        'AuthService',
        'chooseStoreModal',
        '$rootScope',
        'StoreService',
        AddressListController]);

    function AddressListController($scope,
                                   $state,
                                   $log,
                                   UIUtil,
                                   AccountService,
                                   ErrorHandler,
                                   AppAnalytics,
                                   AuthService,
                                   chooseStoreModal,
                                   $rootScope,
                                   StoreService) {


        $scope.title = "Addresses";

        $scope.data = {
            canDelete: true
        };

        $log.info('AddressListController loaded');

        function loadData(){
            $rootScope.$broadcast('refreshCustomerAddressList');
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

        $scope.noDefaultAddress = function() {
            chooseStoreModal.showModal($scope, null, null,false,'accountAddressList')
                .then(function(store){
                    UIUtil.showLoading();
                    var address = AccountService.getCustomerDefaultShoppingAddress();
                    StoreService.selectStoreIdWithAddress(store.id, address)
                        .then(function(){
                            $rootScope.$broadcast('refreshCustomerAddressList');
                            UIUtil.hideLoading();
                        },function(){
                            UIUtil.hideLoading();
                        })
                });
        }

        $scope.clickAddress = function(address) {
            var customer = AccountService.getCustomerInfo(true);
            var defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
            if(defaultShoppingAddress.zip_code != address.zip_code) {
                chooseStoreModal.showModal($scope, null, null,false,'accountAddressList',address)
                    .then(function(store){
                        UIUtil.showLoading();
                        StoreService.selectStoreIdWithAddress(store.id, address)
                            .then(function(){
                                $rootScope.$broadcast('refreshCustomerAddressList');
                                UIUtil.hideLoading();
                            },function(){
                                UIUtil.hideLoading();
                            })
                    });
            } else {
                UIUtil.showLoading();
                customer.default_shopping_address_id = address.id;
                AccountService.updateAccountInfo(customer)
                    .success(function(){
                        AuthService.saveAccountData(customer);
                        $rootScope.$broadcast('refreshCustomerAddressList');
                        UIUtil.hideLoading();
                    })
                    .error(function(error){
                        UIUtil.hideLoading();
                    })
            }
        }

        $scope.deleteAddress = function(address) {
            UIUtil.showConfirm('Delete Address', 'Are you sure you want to delete this address?')
                .then(function(confirmed) {
                    if(confirmed){
                        UIUtil.showLoading();
                        AccountService.deleteAddress(address)
                            .then(function(updatedAddress){
                                UIUtil.hideLoading();
                                loadData();
                            },function(error){
                                UIUtil.hideLoading();
                                LogService.error(error);
                                ErrorHandler.displayShiptAPIError(error,'Error deleting the address' )
                            });
                    }
                });
        };

        $scope.editAddress = function(address){
            AppAnalytics.track('editAddress', {fromLocation:"account"});
            $log.info('editAddress click', address);
            $state.go('app.addEditAddress', {address: angular.toJson(address)});
        };

        $scope.addNewAddress = function() {
            AppAnalytics.track('addAddress', {fromLocation:"account"});
            $state.go('app.addEditAddressMap', {address: angular.toJson(null)});
        };

    };
})();
