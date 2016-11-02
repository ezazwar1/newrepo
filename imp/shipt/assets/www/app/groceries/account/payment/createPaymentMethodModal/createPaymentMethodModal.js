/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('createPaymentMethodModal', [
        '$rootScope',
        '$ionicModal',
        '$q',
        createPaymentMethodModal]);

    function createPaymentMethodModal(
        $rootScope,
        $ionicModal,
        $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/payment/createPaymentMethodModal/createPaymentMethodModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function(modal) {
                selectorModal = modal;
                defer.resolve(selectorModal);
            });
            return defer.promise;
        }

        var init = function($scope) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            if(selectorModal)selectorModal.remove();
            selectorModal = null;
            getModal($scope)
                .then(function(modal){
                    modal.show();
                });

            $scope.closeCardModal = function(newCard) {
                if(newCard){
                    defer.resolve(newCard);
                } else {
                    defer.reject();
                }
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
