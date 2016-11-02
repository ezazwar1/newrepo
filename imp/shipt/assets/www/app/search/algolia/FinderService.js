

(function() {
    'use strict';
    class AlgoliaFinder {

        /**
         * @ngdoc function
         * @name constructor
         */
        constructor($rootScope, $log, $q, AuthService, AlgoliaProductProvider, ConfigService, CommonConfig){
            this.$log = $log;
            this.$q = $q;
            this.searchPromise = null;
            this.client = null;
            this.index = null;
            this.user = null;
            this.AuthService = AuthService;
            this.AlgoliaProductProvider = AlgoliaProductProvider;
            this.ConfigService = ConfigService;
            this.CommonConfig = CommonConfig;
            this.populateConfigData();
            $rootScope.$on('config.data.changed', () => this.populateConfigData())
        }

        populateConfigData() {
            this.ConfigService.getConfig(this.CommonConfig.groceriesContext).then(
                (config) => this.initializeFinderService(config)
            )
        }

        /**
         * @ngdoc function
         * @name initializeAlgoliaClientIndex
         * @description creates the index to search for algolia
         *
         * @param config object
         * @param indexName The name of the index that will be initialized for the next search.
         */
        initializeFinderService (config, indexName = config.algolia_search_index_name) {
            if(config) {
                this.client = algoliasearch(config.algolia_application_id, config.algolia_search_api_key);
                this.index = this.client.initIndex(indexName);
            }
            this.user = this.AuthService.getUserInfo();
        }

        /**
         * @ngdoc function
         * @name searchTerm
         * @description call to search a term
         *
         * @param searchTerm text that is to be searched
         * @param currentPage thea page to be searched, algolia will return results for the next page i think
         * @param facetFilters The facetFilters to be sent along with the search request.
         * @param indexName The algolia index that will be targeted in this search.
         *
         * @returns {Promise} promise that resolves with the results.
         */
        searchTerm (searchTerm, currentPage = null, facetFilters = [], indexName) {
            this.searchTermText = searchTerm;
            this.searchPromise = this.$q.defer();
            try {
                currentPage = _.isNull(currentPage) ? 0 : currentPage + 1;

                if (indexName) {
                    this.initializeFinderService(this.ConfigService.getLocalConfig(), indexName);
                } else if (!this.index) {
                    this.initializeFinderService(this.ConfigService.getLocalConfig());
                }

                this.index.search(
                    searchTerm,
                    {
                        page: currentPage,
                        tags: this.tags(),
                        facets: '*',
                        facetFilters: facetFilters
                    },
                    (err, content) => this.handleSearchResults(err, content)
                );

                return this.searchPromise.promise;
            } catch (e) {
                this.searchPromise.reject(e);
                return this.searchPromise.promise;
            }
        }

        /**
         * @ngdoc function
         * @name tags
         * @description gets the tags for algolia search to display the correct results
         *
         * @returns {array} an array with the tags as strings
         */
        tags () {
            this.user = this.AuthService.getUserInfo();
            var tags = [`metro_${this.user.metro_id}`, `store_${this.user.store_id}`];
            if (this.user.features.product_settings_by_store_location === true) {
                tags.push(`store_location_${this.user.store_location_id}`);
            } else {
                tags.push(`store_location_`);
            }
            return tags;
        }

        /**
         * @ngdoc function
         * @name handleSearchResults
         * @description this is the callback function that handles the results from algolia
         *
         *
         */
        handleSearchResults(err, content){
            try {
                if(err) {
                    this.searchPromise.reject(err)
                } else {
                    var hits = content.hits;
                    var products = [];
                    for (let hit of hits) {
                        products.push(new this.AlgoliaProductProvider.getNew(hit));
                    }

                    var result = {
                        products: products || [],
                        current_page: content.page,
                        total_pages: content.nbPages,
                        facets: content.facets,
                        nbHits: content.nbHits
                    };
                    this.searchPromise.resolve(result);
                }
            } catch (e) {
                this.$log.error(e)
            }
        }
    }

    angular.module('app.shipt.search').service('AlgoliaFinder', AlgoliaFinder);
    AlgoliaFinder.$inject = ['$rootScope','$log', '$q', 'AuthService','AlgoliaProductProvider', 'ConfigService', 'CommonConfig'];
})();
