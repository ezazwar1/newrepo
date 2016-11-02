
(function () {
    'use strict';

    angular.module('shiptApp').controller('SubstitutionOptionsModalController', [
        '$scope',
        '$timeout',
        SubstitutionOptionsModalController]);

    function SubstitutionOptionsModalController($scope,
                                              $timeout) {
        var viewModel = this;

        viewModel.cancel = function(){
            $scope.closeModal(viewModel.selectedOption);
        };

        viewModel.disableSaveButton = function() {
            return viewModel.selectedOption == null;
        };

        viewModel.windowAvailable = function(window) {
            if( window.available === undefined){
                return true;
            } else {
                return window.available ;
            }
        };

        viewModel.saveSelection = function() {
            $scope.closeModal(viewModel.selectedOption);
        };

        $scope.$on('refresh.substitution.options.selector',function(){
            loadData();
        });

        viewModel.clickOption = function(option){
            $timeout(function(){
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                viewModel.saveSelection();
            },200);
        };

        function loadData(){
            viewModel.selectedOption = $scope.selectedOption;
            viewModel.options = $scope.options;
            if(viewModel.selectedOption) {
                var index = viewModel.options.map(function(el) {
                    return el.text;
                }).indexOf(viewModel.selectedOption.text);
                if(index > -1) {
                    viewModel.selectedOption = viewModel.options[index];
                }
            }
        }
    }
})();
