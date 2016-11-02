

(function () {
    'use strict';

    angular.module('shiptApp').controller('ArticleController', [
        '$scope',
        '$stateParams',
        '$state',
        'UIUtil',
        '$log',
        'AccountService',
        'HelpService',
        ArticleController]);

    function ArticleController($scope,
                               $stateParams,
                               $state,
                               UIUtil,
                               $log,
                               AccountService,
                               HelpService) {

        var viewModel = this;
        viewModel.question = undefined;
        viewModel.q = angular.fromJson($stateParams.q);

        function loadAnswer(){
            HelpService.getFaq(viewModel.q.id)
                .then(function(data){
                    viewModel.question = data;
                })
        }

        loadAnswer();
    }
})();
