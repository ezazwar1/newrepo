/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('selectPaymentMethod', [
        '$rootScope',
        '$ionicModal',
        '$q',
        selectPaymentMethod]);

    function selectPaymentMethod(
        $rootScope,
        $ionicModal,
        $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/payment/selectPaymentMethodModal/selectPaymentMethodModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                selectorModal = modal;
                defer.resolve(selectorModal);
            });
            return defer.promise;
        }


        var init = function($scope, sources, selectedSource) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.sources = sources;
            $scope.selectedSource = selectedSource;
            if(selectorModal)selectorModal.remove();
            selectorModal = null;
            getModal($scope)
                .then(function(modal){
                    modal.show();
                });

            $scope.closeModal = function(selectedSource) {
                defer.resolve(selectedSource);
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
