
(function () {
    'use strict';

    angular.module('shiptApp').controller('selectAddressModalController', [
        '$scope',
        '$timeout',
        selectAddressModalController]);

    function selectAddressModalController($scope,
                                              $timeout) {
        var vm = this;

        vm.cancel = function(){
            $scope.closeModal();
        };

        vm.saveSelection = function() {
            $scope.closeModal(vm.selectedAddress);
        };

        vm.clickAddress = function(window){
            $timeout(function(){
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                vm.saveSelection();
            },200);
        };

        vm.addAddressClick = function() {
            $scope.addAddressCall();
            $scope.closeModal();
        };

        function loadData(){
            vm.selectedAddress = $scope.selectedAddress;
            vm.addresses = $scope.addresses;
        }

        loadData();
    }
})();
