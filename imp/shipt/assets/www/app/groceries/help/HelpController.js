

(function () {
    'use strict';

    angular.module('shiptApp').controller('HelpController', [
        '$scope',
        '$rootScope',
        '$state',
        'UIUtil',
        '$log',
        'VersionProvider',
        'HelpService',
        '$filter',
        HelpController]);

    function HelpController($scope,
                            $rootScope,
                            $state,
                            UIUtil,
                            $log,
                            VersionProvider,
                            HelpService,
                            $filter) {

        var viewModel = this;

        viewModel.navToFaq = function(){
            $state.go('app.faq');
        };

        viewModel.contactClick = function(){
            $state.go('app.contactUs');
        };

        viewModel.showFaq = function(){
            if(webVersion){
                return false;
            } else {
                return true;
            }
        };

        function loadVersion(){
            try {
                VersionProvider.getVersionObject()
                    .then(function(version){
                        viewModel.version = version;
                    });
            } catch (exception) {
                $log.error(exception);
            }
        }

        viewModel.searchArticles = [];
        viewModel.searchQuery = "";
        viewModel.showSearch = false;

        function loadFaq(){
            viewModel.loadingSpinner = true;
            HelpService.getFaqs()
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
            return true;
        };

        viewModel.articleClick = function(category){
            $state.go('app.faq', {category: angular.toJson(category)});
        };

        loadFaq();

        loadVersion();

    }
})();
