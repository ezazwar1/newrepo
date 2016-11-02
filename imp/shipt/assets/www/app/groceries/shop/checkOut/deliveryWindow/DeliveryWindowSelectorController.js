
(function () {
    'use strict';

    angular.module('shiptApp').controller('DeliveryWindowSelectorController', [
        '$scope',
        '$timeout',
        DeliveryWindowSelectorController]);

    function DeliveryWindowSelectorController($scope,
                                              $timeout) {
        var viewModel = this;

        viewModel.cancel = function(){
            $scope.closeModal(viewModel.selectedWindow);
        };

        viewModel.disableSaveButton = function() {
            return viewModel.selectedWindow == null;
        };

        viewModel.windowAvailable = function(window) {
            if( window.available === undefined){
                return true;
            } else {
                return window.available ;
            }
        };

        viewModel.saveSelection = function() {
            $scope.closeModal(viewModel.selectedWindow);
        };

        $scope.$on('refresh.delivery.window.selector',function(){
            loadData();
        });

        viewModel.clickWindow = function(window){
            $timeout(function(){
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                viewModel.saveSelection();
            },200);
        };

        $scope.$watch('viewModel.selectedWindow',function(oldValue, newValue){

        });

        function loadData(){
            viewModel.selectedWindow = $scope.selectedWindow;
            viewModel.deliveryWindows = $scope.deliveryWindows;
            if(viewModel.selectedWindow) {
                var index = viewModel.deliveryWindows.map(function(el) {
                    return el.time_slot_id;
                }).indexOf(viewModel.selectedWindow.time_slot_id);
                if(index > -1) {
                    viewModel.selectedWindow = viewModel.deliveryWindows[index];
                }
            }
            console.log('loadData');
        }
    }
})();
