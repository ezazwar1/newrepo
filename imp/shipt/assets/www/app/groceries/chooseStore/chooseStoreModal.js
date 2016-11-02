(function() {
    'use strict';

    angular
        .module('shiptApp')
        .factory('chooseStoreModal', chooseStoreModal);

    chooseStoreModal.$inject = [
        '$rootScope',
        '$ionicModal',
        '$q',
        '$log',
        'IN_APP_MESSAGE',
        'AuthService',
        'FeatureService'];

    function chooseStoreModal(
        $rootScope,
        $ionicModal,
        $q,
        $log,
        IN_APP_MESSAGE,
        AuthService,
        FeatureService) {

        var modal = null;
        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/chooseStore/address/chooseStoreModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function(_modal) {
                defer.resolve(_modal);
            });
            return defer.promise;
        }

        var init = function($scope, zip, store, editShoppingAddressMode = false, source = 'homeScreen', addressToSelectFor) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            var customer = AuthService.getCustomerInfo();
            if(!store) {
                store = customer.store;
            }
            if(!zip) {
                zip = customer.shopping_zip_code;
            }
            $scope.addressToSelectFor = addressToSelectFor;
            var address = null;
            if(customer.customer_addresses){
                address = customer.customer_addresses.find(a => a.id == customer.default_shopping_address_id);    
            }
            $scope.store = store;
            $scope.zip = zip;
            $scope.address = address;
            $scope.editShoppingAddressMode = editShoppingAddressMode;
            $scope.source = source;

            getModal($scope)
                .then(function(_modal){
                    modal = _modal;
                    modal.show().then( function(){
                        $log.info("showing modal again");
                        $('.delivering-to').focus(); // for accessiblity (voice reader)
                    });
                });

            $scope.saveModal = function(store) {
                defer.resolve(store);
                modal.hide();
                modal.remove();
                modal = null;
            };
            $scope.cancelModal = function(){
                defer.reject();
                modal.hide();
                modal.remove();
                modal = null;
            };
            $scope.$on('$destroy', function() {
                if(modal)modal.remove();
            });
            $scope.$watch('vm.editShoppingAddressMode', function(isEditMode) {
                $log.info('editShoppingAddressMode started');
                if(isEditMode){
                    $log.info('editShoppingAddressMode isEditMode');
                    $('.delivery-address-header').focus();
                }
            });

            return defer.promise;
        };

        function isChooseStoreModalShown() {
            if(modal) {
                return modal.isShown();
            } else {
                return false;
            }
        }

        function showIfNeededForAddress($scope){
            if(FeatureService.chooseStoreInApp()){
                var customer = AuthService.getCustomerInfo();
                if( !customer.store || !customer.default_shopping_address_id && !isChooseStoreModalShown() ) {
                    init($scope,null,null,false,'becauseCustomerHasNotChoosenYet')
                }
            }
        };

        var service = {
            showModal: init,
            showIfNeeded: showIfNeededForAddress
        };

        $rootScope.$on('handleOpenUrl.action.openChooseStoreModal',function(){
            service.showModal();
        });

        // This particular event is fired from the common module
        $rootScope.$on(IN_APP_MESSAGE.EVENTS.OPEN_CHOOSE_STORE_MODAL,function() {
            service.showModal();
        });

        return service;

    }
})();
