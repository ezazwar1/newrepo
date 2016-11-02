
(function() {
    'use strict';

    angular
        .module('shiptApp')
        .controller('chooseStoreModalAddressController', chooseStoreModalAddressController);

    chooseStoreModalAddressController.$inject = [
        '$scope',
        '$log',
        'Subscription',
        'selectPaymentMethod',
        'UIUtil',
        'AuthService',
        'ErrorHandler',
        '$rootScope',
        'createPaymentMethodModal',
        'FeatureService',
        '$timeout',
        'Geolocator',
        'PlacesAutocomplete',
        'StoreService',
        'ShiptLogItemsService',
        '$cordovaKeyboard',
        'AppAnalytics',
        '$ionicScrollDelegate'
    ];

    function chooseStoreModalAddressController(
        $scope,
        $log,
        Subscription,
        selectPaymentMethod,
        UIUtil,
        AuthService,
        ErrorHandler,
        $rootScope,
        createPaymentMethodModal,
        FeatureService,
        $timeout,
        Geolocator,
        PlacesAutocomplete,
        StoreService,
        ShiptLogItemsService,
        $cordovaKeyboard,
        AppAnalytics,
        $ionicScrollDelegate) {

        var vm = this;

        vm.requireZip = false;
        vm.addressPlaceholder = "Enter Address";
        vm.suggestButtonText = "New Store Request";
        vm.changeAddressText = `Change<br>Address`;

        init();

        function init() {
            hideSpinner();
            getCurrentLocationAddress();
            loadCustomerAddresses();
            vm.selectedAddress = $scope.address;
            vm.editShoppingAddressMode = $scope.editShoppingAddressMode;
            if($scope.addressToSelectFor){
                vm.selectedAddress = $scope.addressToSelectFor
            }
            AppAnalytics.track('chooseStoreModal.show',{addressPassedIn:vm.selectedAddress,source: $scope.source})
            if(!vm.selectedAddress) {
                vm.requireZip = true;
                selectZipInput();
            } else {
                loadStoresForAddress();
            }
            if($scope.store) {
                vm.selectedStore = $scope.store;
            }

        };

        function selectZipInput() {
            $timeout(function () {
                var element1 = angular.element("#chooseStoreAddressInput");
                element1.select();
            }, 300);
        }

        vm.cancel = function(store) {
            if(store){
                $scope.saveModal(store);
            } else {
                $scope.cancelModal();
            }
        };

        vm.clickAddress = function(address) {
            try {
                vm.selectedAddress = address;
                AppAnalytics.track('chooseStoreModal.clickAddress',{address:vm.selectedAddress})
                loadStoresForAddress();
                vm.editShoppingAddressMode = false;
                $ionicScrollDelegate.scrollTop();
            } catch (e) {
                $log.error(e);
            }
        };

        vm.addAddress = function() {
            vm.selectedAddress = null;
            vm.editShoppingAddressMode = false;
            selectZipInput();
            AppAnalytics.track('chooseStoreModal.addAddressClick')
        }

        vm.changeAddress = function() {
            if(vm.requireZip){
                vm.selectedAddress = null;
                selectZipInput();
                AppAnalytics.track('chooseStoreModal.changeAddressClick')
            } else {
                $log.info('changeAddressClicked');
                $('.delivering-to').focus();
                vm.editShoppingAddressMode = true;
            }
            $ionicScrollDelegate.scrollTop();
        };

        vm.clickStore = function(store) {
            try {
                UIUtil.showLoading('Saving Store...');
                AppAnalytics.track('chooseStoreModal.clickOnStore',{store: store})
                vm.selectedStore = store;
                StoreService.selectStoreWithAddress(store, vm.selectedAddress)
                    .then(function(){
                        UIUtil.hideLoading();
                        vm.cancel(store);
                        $rootScope.$broadcast('refresh.user-data');
                    },function(error){
                        ErrorHandler.displayShiptAPIError(error);
                        UIUtil.hideLoading();
                    })
            } catch (e) {
                UIUtil.hideLoading();
            }
        };

        vm.getAddressString = function(address) {
            var string = "";
            string += address.street1 + ", ";
            if(address.street2){
                string += address.street2 + ", ";
            }
            string += address.city + ", ";
            string += address.state + " ";
            string += address.zip_code;
            return string;
        };

        $scope.$watch('vm.addressText', function (val) {
            if(!vm.addressText || vm.addressText == "" || vm.addressText.length < 4){
                vm.addressResults = null;
            } else {
                vm.searchForAddress();
            }
        });

        vm.searchForAddress = function() {
            try {
                if(vm.addressText && vm.addressText != ""){
                    PlacesAutocomplete.searchText(vm.addressText)
                        .then(function(results){
                            vm.addressResults = [];
                            for (var i = 0; i < results.predictions.length; i++) {
                                PlacesAutocomplete.getPlaceDetails(results.predictions[i])
                                    .then(function(address){
                                        try {
                                            var thePlace = address;
                                            if (!thePlace.result) {
                                                thePlace = {
                                                    result: address
                                                }
                                            }
                                            var res = PlacesAutocomplete.parseResult(thePlace.result);
                                            if (res) {
                                                vm.addressResults.push(res);
                                            }
                                        } catch (e) {

                                        }
                                    })
                            }
                        }, function(error) {
                            vm.addressResults = [];
                            $log.info('ERROR: ', error);
                        });
                }
            } catch (e) {
                vm.addressResults = [];
            }
        }

        vm.suggestStore = function() {
            //get store name
            var storeName = "";
            UIUtil.promptForInput('Where Next?', 'Let us know a store brand you would like us to offer in the future.', 'Submit')
                .then(function(name){
                    if(name && name != ""){
                        vm.suggestButtonText = "Saving...";
                        AppAnalytics.track('chooseStoreModal.requestNewStore',{storeRequest: name});
                        ShiptLogItemsService.logInfo('customer_request_store','request',{zip: vm.zip, store_name: storeName})
                            .then(function(){
                                vm.suggestButtonText = "Saved!"
                            },function(){
                                vm.suggestButtonText = "Error"
                            })
                    }
                }, function(){
                    vm.suggestButtonText = "New Store Request"
                })
            $cordovaKeyboard.show();
        };

        function loadCustomerAddresses() {
            try {
                var user = AuthService.getUserInfo();
                vm.customer_addresses = user.customer_addresses;
            } catch (e) {

            }
        }

        function getCurrentLocationAddress() {
            Geolocator.getCurrentPosition(true)
                .then(function(){
                    var lat = Geolocator.latitude();
                    var long = Geolocator.longitude();
                    PlacesAutocomplete.getReverseGeoAddress(lat, long)
                        .then(function(data){
                            vm.currentLocationAddress = data;
                        },function(error){
                            UIUtil.showAlert('Error Getting Current Address','')
                        })
                });
        };

        $scope.$watch('vm.zipCode', function() {
            var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(vm.zipCode);
            if(isValidZip){
                //search for stores if valid zip
                loadStoresForAddress();
            } else {
                //let them keep typing
                hideSpinner();
            }
        });

        function loadStoresForAddress () {
            try {
                showSpinner();
                vm.stores = null;
                StoreService.listForAddress(vm.selectedAddress)
                    .then(function(stores) {
                        vm.stores = sortStores(stores);
                        $('.edit-address-button').focus();
                        AppAnalytics.track('chooseStoreModal.storesDisplayedForAddress',{stores: vm.stores, address: vm.selectedAddress});
                        hideSpinner();
                    }, function(error) {
                        ErrorHandler.displayShiptAPIError(error,'Error Getting Stores For Zip');
                        hideSpinner();
                    })
            } catch (e) {

            }
        }

        function sortStores(stores) {
            return _.sortBy(stores, function(store) { // Pull new stores to the top
                if (store.new_store) {
                    return store;
                }
            });
        }

        function showSpinner() {
            vm.showSpinner = true;
        }

        function hideSpinner() {
            vm.showSpinner = false;
        }
    }
})();
