/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('DeliveryWindowSelectorProvider', [
        '$rootScope',
        '$ionicModal',
        '$q',
        DeliveryWindowSelectorProvider]);

    function DeliveryWindowSelectorProvider(
        $rootScope,
        $ionicModal,
        $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            if(selectorModal){
                defer.resolve(selectorModal);
            } else {
                var tpl = 'app/groceries/shop/checkOut/deliveryWindow/deliveryWindowSelector.html';
                $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    selectorModal = modal;
                    defer.resolve(selectorModal);
                });
            }
            return defer.promise;
        }


        var init = function($scope, deliveryWindows, selectedWindow) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.deliveryWindows = deliveryWindows;
            $scope.selectedWindow = selectedWindow;
            if(selectorModal)selectorModal.remove();
            selectorModal = null;
            getModal($scope)
                .then(function(modal){
                    $scope.$broadcast('refresh.delivery.window.selector');
                    modal.show();
                });

            $scope.closeModal = function(selectedWindow) {
                defer.resolve(selectedWindow);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function() {
                if(selectorModal)selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showSelectDeliveryWindowModal: init
        }

    }
})();
