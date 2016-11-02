
(function () {
    'use strict';

    angular.module('shiptApp').factory('TippingModalProvider', [
        '$rootScope',
        '$ionicModal',
        '$q',
        TippingModalProvider]);

    function TippingModalProvider($rootScope,
                                    $ionicModal,
                                    $q ){

        var tippingModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            var tpl = 'app/groceries/tipping/tippingModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope
            }).then(function(modal) {
                tippingModal = modal;
                defer.resolve(tippingModal);
            });
            return defer.promise;
        }


        var init = function($scope, order) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.order = null;
            $scope.order = order;

            getModal($scope)
                .then(function(modal){
                    modal.show();
                });

            $scope.closeModal = function(order) {
                defer.resolve(order);
                tippingModal.hide();
                tippingModal.remove();
                tippingModal = null;
            };

            $scope.$on('$destroy', function() {
                if(tippingModal)tippingModal.remove();
                tippingModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        }

    }
})();
