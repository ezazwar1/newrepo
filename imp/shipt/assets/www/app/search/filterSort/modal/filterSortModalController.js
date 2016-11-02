(function() {
    'use strict';

    angular
        .module('app.shipt.search')
        .controller('filterSortModalController', filterSortModalController);

    filterSortModalController.$inject = ['$rootScope', '$scope', 'FILTER_SORT', 'AppAnalytics', '$ionicScrollDelegate'];

    /* @ngInject */
    function filterSortModalController($rootScope, $scope, FILTER_SORT, AppAnalytics, $ionicScrollDelegate) {
        var vm = this;

        $scope.$on(FILTER_SORT.EVENTS.RESET, () => {
            resetFilterSort($scope.filterSortOptions.sort, true);
            resetFilterSort($scope.filterSortOptions.categories);
            resetFilterSort($scope.filterSortOptions.brands);
            $scope.filterSortOptions.filterCount = 0;
        });

        vm.clear = function() {
            resetFilterSort($scope.filterSortOptions.sort, true);
            resetFilterSort($scope.filterSortOptions.categories);
            resetFilterSort($scope.filterSortOptions.brands);
            $scope.filterSortOptions.filterCount = 0;
            $ionicScrollDelegate.resize();
            $rootScope.$broadcast(FILTER_SORT.EVENTS.CLEAR_FILTER, {
                refreshSearch: true,
                searchTerm: $scope.filterSortOptions.extras.AlgoliaFinder.searchTermText
            });
        };

        function resetFilterSort(filterSort, isSort = false) {
            filterSort.displayExpanded = false;
            for (let option of filterSort.options) {
                option.selected = false;
            }

            if (isSort) {
                filterSort.isNewSortApplied = false;
                _.findWhere(filterSort.options, {displayName: filterSort.defaultSelection}).selected = true;
            }
        }

        vm.cancel = function() {
            $scope.closeModal();
            $scope.filterSortOptions.sort.displayExpanded = false;
            $scope.filterSortOptions.categories.displayExpanded = false;
            $scope.filterSortOptions.brands.displayExpanded = false;
            AppAnalytics.filterSort({
                sortBy: $scope.filterSortOptions.sort.selectedOption().displayName,
                filterCategories: $scope.filterSortOptions.categories.selectedOptionsDisplay(),
                filterBrands: $scope.filterSortOptions.brands.selectedOptionsDisplay()
            });
        }
    }
})();
