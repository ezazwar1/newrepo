(function() {
    'use strict';

    angular
        .module('app.shipt.search')
        .directive('filterSort', filterSort);

    /* @ngInject */
    function filterSort() {

        var webTemplateUrl = "app/search/filterSort/filterSortDirective/webFilterSort.html",
            normaltemplateUrl = "app/search/filterSort/filterSortDirective/filterSort.html",
            templateUrl = null;

        if(webVersion) {
            templateUrl = webTemplateUrl;
        } else {
            templateUrl = normaltemplateUrl;
        }

        var directive = {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                categories: '=categories',
                brands: '=brands',
                filterSortOptions: "=filterSortOptions"
            },
            link: linkFunc,
            controller: filterSortDirectiveController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    filterSortDirectiveController.$inject = ['$attrs','$scope','$log','filterSortOptions', 'AlgoliaFinder', 'FeatureService', 'COMMON_FEATURE_TOGGLES'];

    function filterSortDirectiveController($attrs, $scope, $log, filterSortOptions, AlgoliaFinder, FeatureService, COMMON_FEATURE_TOGGLES) {
        var vm = this;
        vm.filterSortOptions = $scope.vm.filterSortOptions;

        // Feature toggle for allowing algolia sort
        vm.algoliaSortEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_SORT_ENABLED);

    }
})();
