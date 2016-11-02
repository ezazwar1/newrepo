/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('selectAddressModal', [
        '$rootScope',
        '$ionicModal',
        '$q',
        selectAddressModal]);

    function selectAddressModal(
        $rootScope,
        $ionicModal,
        $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/address/selectAddressModal/selectAddressModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                selectorModal = modal;
                defer.resolve(selectorModal);
            });
            return defer.promise;
        }


        var init = function($scope, addresses, selectedAddress, addAddressCall) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.addresses = addresses;
            $scope.selectedAddress = selectedAddress;
            $scope.addAddressCall = addAddressCall;
            if(selectorModal)selectorModal.remove();
            selectorModal = null;
            getModal($scope)
                .then(function(modal){
                    modal.show();
                });

            $scope.closeModal = function(selectedAddress) {
                defer.resolve(selectedAddress);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function() {
                if(selectorModal)selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        }

    }
})();
