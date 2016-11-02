

(function () {
    'use strict';

    angular.module('shiptApp').controller('FaqController', [
        '$state',
        '$filter',
        'HelpService',
        '$stateParams',
        FaqController]);

    function FaqController( $state,
                            $filter,
                            HelpService,
                            $stateParams) {

        var viewModel = this;
        viewModel.searchArticles = [];
        viewModel.searchQuery = "";
        viewModel.showSearch = false;

        viewModel.category = angular.fromJson($stateParams.category);

        function loadFaq(){
            viewModel.loadingSpinner = true;
            HelpService.getFaqsForCategory(viewModel.category.id)
                .then(function(data){
                    viewModel.articles = data;
                    viewModel.loadingSpinner = false;
                },function(error){
                    viewModel.errorHappened = true;
                    viewModel.loadingSpinner = false;
                })
        }

        viewModel.clearSearch = function(){
            viewModel.searchQuery = '';
        };

        viewModel.showList = function() {
            if(!viewModel.articles) return false;
            if(viewModel.articles.length < 1) return false;
            if($filter('filter')(viewModel.articles, viewModel.searchQuery).length < 1) return false;
            return true;
        };

        viewModel.articleClick = function(article){
            $state.go('app.faqArticle', {q: angular.toJson(article)});
        };

        loadFaq()
    }
})();
