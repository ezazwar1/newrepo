(function() {
    'use strict';

    angular
        .module('app.shipt.search')
        .service('filterSortOptions', filterSortOptions);

    filterSortOptions.$inject = ['$rootScope', '$log', 'AlgoliaFinder', 'FILTER_SORT', 'ConfigService', 'CommonConfig', '$q', '$timeout', '$ionicScrollDelegate'];

    /* @ngInject */
    function filterSortOptions($rootScope, $log, AlgoliaFinder, FILTER_SORT, ConfigService, CommonConfig, $q, $timeout, $ionicScrollDelegate) {

        // This extras object holds all dependencies that may be needed in the class definitions for FilterSort
        var extras = {
            AlgoliaFinder: AlgoliaFinder,
            $rootScope: $rootScope,
            FILTER_SORT: FILTER_SORT,
            ConfigService: ConfigService,
            CommonConfig: CommonConfig,
            $q: $q,
            $log: $log,
            $timeout: $timeout,
            $ionicScrollDelegate: $ionicScrollDelegate
        };

        this.init = function(categories, brands) {
            return new FilterSort(categories, brands, extras);
        };
    }

    /**
     * @ngdoc class
     * @name FilterSort
     * @description Represents the primary model and functionality for filtering and sorting.
     *
     * @param categories The categories that will be built for this filter sort.
     * @param brands The brands that will be built for this filter sort.
     * @param extras {Object} Containing the additional dependencies that will be used in various child classes.
     */
    class FilterSort {
        constructor(categories, brands, extras) {
            this.sort = new SortOptions(extras);
            this.categories = new CategoriesFilter(this.getArrayForFacet(categories), extras);
            this.brands = new BrandsFilter(this.getArrayForFacet(brands), extras);
            this.extras = extras;
            this.filterCount = 0;
            this.setCurrentFacets(categories, brands);
        }

        getArrayForFacet(facet) {
            //because the facets come in with the values as the properties... weird
            var values = [];
            for (var property in facet) {
                values.push (property);
            }
            return values;
        }

        selectOption(option, singleSelect = false) {
            if (singleSelect) {
                this.sort.isNewSortApplied = true;
                for (let op of this.sort.options) {
                    op.selected = false;
                }
                option.selected = true;
            } else {
                if (!option.isCurrentFacet) { // Prevent selection of facets having 0 results
                    return;
                }

                option.selected = !option.selected;
                if (option.selected) {
                    this.filterCount++;
                } else {
                    this.filterCount--;
                }
            }

            this.updateFilterSortSearchResults();
        }

        updateFilterSortSearchResults(searchTerm = null) {
            this.extras.$rootScope.$broadcast(this.extras.FILTER_SORT.EVENTS.APPLY_FILTER, this._getFilterSortModelForSearch(searchTerm));
        }

        getFacetFiltersForSearch() {
            var facetFilters = [];
            for(let category of this.categories.options) {
                if(category.selected) {
                    facetFilters.push(`${this.categories.facetFilterValue}:${category.displayName}`)
                }
            }
            for(let brand of this.brands.options) {
                if(brand.selected) {
                    facetFilters.push(`${this.brands.facetFilterValue}:${brand.displayName}`)
                }
            }
            return facetFilters;
        }

        isFilterSortActive() {
            return this.sort.isNewSortApplied || this.filterCount > 0;
        }

        toggleExpandSection(section) {
            section.displayExpanded = !section.displayExpanded;
            this.extras.$timeout(() => {this.extras.$ionicScrollDelegate.resize();});
        }

        setCurrentFacets(categoryFacets, brandFacets) {
            let currentCategoryFacets = this.getArrayForFacet(categoryFacets);
            for (let category of this.categories.options) {
                category.isCurrentFacet = _.contains(currentCategoryFacets, category.displayName);
            }

            let currentBrandFacets = this.getArrayForFacet(brandFacets);
            for (let brand of this.brands.options) {
                brand.isCurrentFacet = _.contains(currentBrandFacets, brand.displayName);
            }
        }

        _getFilterSortModelForSearch(searchTerm = null) {
            return {
                searchTerm: searchTerm || this.extras.AlgoliaFinder.searchTermText,
                facetFilters: this.getFacetFiltersForSearch(),
                indexName: this.sort.selectedOption().algoliaIndex
            };
        }
    }

    /**
     * @ngdoc class
     * @name Filter
     * @description Super class for the various common filtering functionality.
     */
    class Filter {
        constructor() {
            this.options = [];
            this.displayExpanded = false;
        }

        populateOptions(options) {
            for (let option of options) {
                this.options.push(new FilterSortOption(option));
            }
        }

        selectedOptionsDisplay() {
            var display = '';
            for (let op of this.options) {
                if(op.selected) {
                    display += ` ${op.displayName},`
                }
            }

            display = (display === '') ? this.defaultSelection : display.removeTrailingComma();

            return display;
        }

    }

    /**
     * @ngdoc class
     * @name FilterSortOption
     * @description Represents a single filter sort option.
     */
    class FilterSortOption {
        constructor(name,  selected = false, algoliaIndex = null) {
            this.displayName = name;
            this.algoliaIndex = algoliaIndex;
            this.selected = selected;
        }
    }

    /**
     * @ngdoc class
     * @name SortOptions
     * @description Represents sorting functionality.
     *
     * @param extras {Object} Containing the additional dependencies that will be used for support functionality.
     */
    class SortOptions {
        constructor(extras = {}) {
            this.displayExpanded = false;
            this.options = [];
            this.defaultSelection = extras.FILTER_SORT.OPTIONS.SORT_POPULARITY;
            this.isNewSortApplied = false;
            this._populateSortOptions(extras);
        }

        selectedOption() {
            return this.options.find(op => op.selected);
        }

        _populateSortOptions(extras) {
            this._getSortIndexesForEnvironment(extras).then((indicies) => {
                const INDEX = indicies;
                this.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_POPULARITY, true));
                this.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_PRICE_LOW_HIGH, false, INDEX.SORT_PRICE_LOW_HIGH));
                this.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_PRICE_HIGH_LOW, false, INDEX.SORT_PRICE_HIGH_LOW));
                this.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_BRAND_A_Z, false, INDEX.SORT_BRAND_A_Z));
                this.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_BRAND_Z_A, false, INDEX.SORT_BRAND_Z_A));
            });
        }

        _getSortIndexesForEnvironment(extras) {
            let defaultIndicies = extras.FILTER_SORT.INDEXES.PRODUCTION,
                deferred = extras.$q.defer();
            extras.ConfigService.getConfig(extras.CommonConfig.groceriesContext).then(
                (config) => {
                    if (config.environment_name === extras.CommonConfig.stagingEnvironmentName) {
                        deferred.resolve(extras.FILTER_SORT.INDEXES.STAGING);
                    } else { // Resolve the production indexes
                        deferred.resolve(extras.FILTER_SORT.INDEXES.PRODUCTION);
                    }
                }, (err) => {
                    extras.$log.error(err);
                    deferred.resolve(defaultIndicies);
                }
            );

            return deferred.promise;
        }
    }

    /**
     * @ngdoc class
     * @name BrandsFilter
     * @description Represents the filter for brands.
     *
     * @param brandNames The brands names available to filter on.
     * @param extras {Object} Containing the additional dependencies that will be used for support functionality.
     */
    class BrandsFilter extends Filter {
        constructor(brandNames, extras = {}) {
            super();
            this.facetFilterValue = extras.FILTER_SORT.FACETS.BRANDS;
            this.defaultSelection = extras.FILTER_SORT.OPTIONS.DEFAULT_BRANDS;
            this.populateOptions(brandNames);
        }

    }

    /**
     * @ngdoc class
     * @name CategoriesFilter
     * @description Represents the filter for categories.
     *
     * @param categoryNames The category names available to filter on.
     * @param extras {Object} Containing the additional dependencies that will be used for support functionality.
     */
    class CategoriesFilter extends Filter {
        constructor(categoryNames, extras = {}) {
            super();
            this.facetFilterValue = extras.FILTER_SORT.FACETS.CATEGORIES;
            this.defaultSelection = extras.FILTER_SORT.OPTIONS.DEFAULT_CATEGORIES;
            this.populateOptions(categoryNames);
        }

    }

    //TODO: eventually move this to some sort of util class
    String.prototype.removeTrailingComma = function() {
        try {
            return this.replace(/,\s*$/, "");
        } catch (e) {
            return this;
        }
    };

})();
