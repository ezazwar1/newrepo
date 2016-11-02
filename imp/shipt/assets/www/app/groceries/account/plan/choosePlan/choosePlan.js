/**
 * Created by Shipt
 */

(function () {
    'use strict';

    angular.module('shiptApp').factory('choosePlan', [
        '$rootScope',
        '$ionicModal',
        '$q',
        choosePlan]);

    function choosePlan(
        $rootScope,
        $ionicModal,
        $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/plan/choosePlan/choosePlan.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                defer.resolve(modal);
            });
            return defer.promise;
        }


        var init = function($scope, plans, selectedPlan) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.plans = plans;
            $scope.selectedPlan = selectedPlan;
            if(selectorModal)selectorModal.remove();
            selectorModal = null;
            getModal($scope)
                .then(function(modal){
                    selectorModal = modal;
                    modal.show();
                });

            $scope.closeModal = function(selectedPlan) {
                if (selectedPlan) {
                    defer.resolve(selectedPlan);
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
