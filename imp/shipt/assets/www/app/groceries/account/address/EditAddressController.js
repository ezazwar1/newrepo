/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('EditAddressController', [
        '$scope',
        '$log',
        '$rootScope',
        '$ionicHistory',
        '$stateParams',
        'AccountService',
        'UIUtil',
        'LogService',
        'PlacesAutocomplete',
        'ErrorHandler',
        'AppAnalytics',
        'StoreService',
        '$q',
        '$timeout',
        'FeatureService',
        'ShiptLogItemsService',
        EditAddressController]);

    function EditAddressController($scope,
                               $log,
                               $rootScope,
                               $ionicHistory,
                               $stateParams,
                               AccountService,
                               UIUtil,
                               LogService,
                               PlacesAutocomplete,
                               ErrorHandler,
                               AppAnalytics,
                               StoreService,
                               $q,
                               $timeout,
                               FeatureService,
                               ShiptLogItemsService) {

        $scope.title = "Edit Address";
        $log.info('accountController loaded');
        $scope.addingNewAddressMode = false;

        $scope.$on('$ionicView.beforeEnter', function(){
            $log.info('beforeEnter, state params: ', $stateParams.address);
            $scope.address = angular.fromJson($stateParams.address);
            $scope.fromSearch = angular.fromJson($stateParams.fromSearch);
            $scope.fromCheckout = angular.fromJson($stateParams.fromCheckout);
            $scope.redirectedFromMap = ($scope.address && $scope.address.id == undefined) || $scope.fromSearch;
            if($scope.address == null || $scope.redirectedFromMap){
                $scope.title = "Add Address";
                $scope.addingNewAddressMode = true;
            } else {
                $scope.title = "Edit Address";
                $scope.addingNewAddressMode = false;
            }
        });

        $scope.streetInputChanged = function() {
            try {
                if($scope.address.street1){
                    PlacesAutocomplete.searchText($scope.address.street1)
                        .then(function(results){
                            $log.info('RESULTS: ', results);
                        }, function(error) {
                            $log.info('ERROR: ', error);
                        })
                }

            } catch (e) {
                $log.error(e);
            }
        }

        function handleFromCheckout(newAddress) {
            AccountService.refreshCustomerInfo()
                .then(function(customer){
                    getAddressWithStoreDataPopulated(newAddress.id)
                        .then(function(address){
                            UIUtil.hideLoading();
                            newAddress = address;
                            var currentDefaultAddress = customer.customer_addresses.find(a => a.id == customer.default_shopping_address_id);
                            if(!currentDefaultAddress) {
                                $ionicHistory.goBack(-2);
                            }
                            if (currentDefaultAddress.store_location_id == newAddress.store_location_id){
                                StoreService.selectStoreIdWithAddress(newAddress.store_id, newAddress)
                                    .then(function(){
                                        UIUtil.hideLoading();
                                        $ionicHistory.goBack(-2);
                                    },function(error){
                                        UIUtil.hideLoading();
                                    });

                            } else if (currentDefaultAddress.store_id == newAddress.store_id ) {
                                UIUtil.showYesNoConfirm('This address is serviced by a different store.', "We can update your cart however: Some items may have changed price. Sales may not be applicable. Some items may be unavailable. Want us to update your cart?", "Yes","No")
                                    .then(function(shouldChangeStoreAndStuff){
                                        if(shouldChangeStoreAndStuff){
                                            AppAnalytics.track('customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:true});
                                            ShiptLogItemsService.logInfo('analytics','customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:true});
                                            StoreService.selectStoreIdWithAddress(newAddress.store_id,newAddress)
                                                .then(function(){
                                                    UIUtil.hideLoading();
                                                    $ionicHistory.goBack(-3);
                                                },function(error){
                                                    UIUtil.hideLoading();
                                                });
                                        } else {
                                            AppAnalytics.track('customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:false});
                                            ShiptLogItemsService.logInfo('analytics','customerCheckoutChangeStoreLocationWarned',{customerChangedAddress:false});
                                            UIUtil.hideLoading();
                                            $ionicHistory.goBack(-2);
                                        }
                                    })
                            } else if (currentDefaultAddress.store_id != newAddress.store_id) {
                                AppAnalytics.track('customerCheckoutChangeStoreBlocked');
                                ShiptLogItemsService.logInfo('analytics','customerCheckoutChangeStoreBlocked');
                                UIUtil.hideLoading();
                                UIUtil.showAlert('This address is not in your selected store\'s service area.', "To change where you are shopping please change your location on the home screen of the app.")
                                $ionicHistory.goBack(-2);
                            }

                        },function(error){
                            UIUtil.hideLoading();
                        });
                });
        };

        function getAddressWithStoreDataPopulated(addressId, defer) {
            if(!defer){
                defer = $q.defer();
            }
            //poll for address until the data is there
            AccountService.getAddress(addressId)
                .then(function(address){
                    if(address.store_id && address.store_location_id){
                        defer.resolve(address);
                    } else {
                        $timeout(function(){
                            return getAddressWithStoreDataPopulated(addressId, defer);
                        }, 2000)
                    }
                },function(error){
                    ErrorHandler.displayShiptAPIError(error);
                    defer.reject(error);
                })

            return defer.promise;
        }

        $scope.saveAddress = function(address) {
            //do the save of the address
            UIUtil.showLoading();
            $log.info('saveAddress click', address);
            if($scope.addingNewAddressMode){
                AccountService.addAddress(address)
                    .then(function(newAddress){
                        $rootScope.$broadcast('refresh.user-data');
                        if($scope.fromCheckout && FeatureService.chooseStoreInApp()) {
                            handleFromCheckout(newAddress);
                        } else if ($scope.redirectedFromMap){
                            UIUtil.hideLoading();
                            $ionicHistory.goBack(-2);
                        } else {
                            UIUtil.hideLoading();
                            $ionicHistory.goBack();
                        }
                        AppAnalytics.addAddress(newAddress);
                    },function(error){
                        UIUtil.hideLoading();
                        LogService.info({
                            error:error,
                            message: 'addAddress Error',
                            address: address
                        });
                        ErrorHandler.displayShiptAPIError(error,'Error Creating Address');
                    });
            } else {
                AccountService.updateAddress(address)
                    .then(function(updatedAddress){
                        $rootScope.$broadcast('refresh.user-data');
                        UIUtil.hideLoading();
                        $ionicHistory.goBack();
                    },function(error){
                        UIUtil.hideLoading();
                        LogService.info({
                            error:error,
                            message: 'updateAddress Error',
                            address: address
                        });
                        AppAnalytics.track('addressSaveError', error);
                        ErrorHandler.displayShiptAPIError(error,'Error Updating Address');
                    });
            }
        };

        $scope.deleteAddress = function(deleteAddress){
            UIUtil.showConfirm('Delete Address', 'Are you sure you want to delete this address?')
                .then(function(confirmed) {
                    if(confirmed){
                        UIUtil.showLoading();
                        AccountService.deleteAddress($scope.address)
                            .then(function(updatedAddress){
                                $rootScope.$broadcast('refresh.user-data');
                                UIUtil.hideLoading();
                                $ionicHistory.goBack();
                            },function(error){
                                UIUtil.hideLoading();
                                LogService.error(error);
                                ErrorHandler.displayShiptAPIError(error,'Error deleting the address.');
                            });
                    }
                });
        };

    }
})();
