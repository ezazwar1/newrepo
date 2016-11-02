
(function () {
    'use strict';

    angular.module('shiptApp').controller('selectedPaymentMethodModalController', [
        '$scope',
        '$timeout',
        selectedPaymentMethodModalController]);

    function selectedPaymentMethodModalController($scope,
                                              $timeout) {
        var vm = this;

        vm.cancel = function(){
            $scope.closeModal();
        };

        vm.saveSelection = function() {
            $scope.closeModal(vm.selectedSource);
        };

        vm.clickSource = function(window){
            $timeout(function(){
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                vm.saveSelection();
            },200);
        };

        function loadData(){
            vm.selectedSource = $scope.selectedSource;
            vm.sources = $scope.sources;
        }

        loadData();
    }
})();
