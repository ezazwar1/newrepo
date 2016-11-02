(function() {
    'use strict';

    angular
        .module('shiptApp')
        .factory('planProvider', planProvider);

    planProvider.$inject = [
        '$rootScope',
        '$ionicModal',
        '$q'];

    /* @ngInject */
    function planProvider($rootScope,
                                    $ionicModal,
                                    $q) {

        var modal = null;
        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/plan/plan.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                focusFirstInput: true
            }).then(function(_modal) {
                defer.resolve(_modal);
            });
            return defer.promise;
        }


        var init = function($scope, plan) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.plan = plan;
            getModal($scope)
                .then(function(_modal){
                    modal = _modal;
                    modal.show();
                });

            $scope.saveModal = function() {
                defer.resolve();
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

            return defer.promise;
        };

        var service = {
            showModal: init
        };

        return service;

    }
})();
