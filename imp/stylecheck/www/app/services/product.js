/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.service('productService', [
        '$q',
        '$rootScope',
        '$http',
        function ($q, $rootScope, $http) {
            var abortPromises = [];
            this.params = {
                'url': 'http://product-api.affili.net/V3/productservice.svc/JSON/SearchProducts',
                'config': {
                    'params': {
                        'publisherId': '717588',
                        'Password': '1qepbvxTvhWBBi3Kmp4J',
                        'PageSize': 500,
                        'SortBy': 'Score',
                        'ImageScales': 'Image120,OriginalImage',
                        'facetFields': 'Property_CF_gender,Property_CF_Gender,Property_CF_geschlecht,Property_CF_diviv'
                    }
                }
            };
            this.set_query = function (paramsExt) {
                var querystring = $rootScope.dict.clothes.subcategories[paramsExt.clothes][paramsExt.name].search +
                    //Test for no Products
                    //"lgflkjdflgldf" +
                    " AND (" + paramsExt.color + "* OR " + $rootScope.dict.colors[paramsExt.color] + "*)";
                if (paramsExt.category === 'sport') {
                    querystring += " AND sport*";
                }
                if (paramsExt.brand) {
                    paramsExt.config.params.fq = 'Brand:' + paramsExt.brand;
                } else {
                    delete paramsExt.config.params.fq;
                }
                paramsExt.config.params.query = querystring;
                return paramsExt;
            };
            var filterProductsByGender = function (data, paramsExt) {
                var facetGender,
                    productGender = false,
                    genderMatched,
                    selectedGender = paramsExt.genderMap[paramsExt.gender],
                    n = 0,
                    i = 0,
                    j = 0,
                    k = 0,
                    filter = {},
                    products = [];

                for (i; i < data.Facets.length; i = i + 1) {
                    for (j; j < data.Facets[i].FacetValues.length; j = j + 1) {
                        for (k; k < selectedGender.length; k = k + 1) {
                            facetGender = data.Facets[i].FacetValues[j].FacetValueName;
                            if (angular.lowercase(facetGender) === angular.lowercase(selectedGender[k])) {
                                filter.emergencyFilterQuery = data.Facets[i].FacetField + ':' + facetGender;
                                filter.genderMatchedInFacet = true;
                            }
                        }
                    }
                    if (filter.genderMatchedInFacet) {
                        break;
                    }
                }

                for (i = 0; i < data.Products.length; i = i + 1) {
                    for (j = 0; j < data.Products[i].Properties.length; j = j + 1) {
                        for (k = 0; k < paramsExt.genderMap.keys.length; k = k + 1) {
                            if (angular.lowercase(paramsExt.genderMap.keys[k]) === angular.lowercase(data.Products[i].Properties[j].PropertyName)) {
                                productGender = data.Products[i].Properties[j].PropertyValue;
                            }
                        }
                        if (productGender) {
                            break;
                        }
                    }
                    if (productGender) {
                        for (j = 0; j < selectedGender.length; j = j + 1) {
                            if (angular.lowercase(productGender) === angular.lowercase(selectedGender[j])) {
                                genderMatched = true;
                                break;
                            }
                        }
                    }
                    if (genderMatched === true) {
                        products.push(data.Products[i]);
                        n = n + 1;
                    }
                    productGender = false;
                    genderMatched = false;
                    if (n >= paramsExt.maxHits) {
                        break;
                    }
                }
                filter.products = products;
                return filter;
            };

            this.getProducts = function (params, noCancel) {
                var paramsExt = angular.extend(params, this.params),
                    q = $q.defer(),
                    data = {
                        'Products': []
                    };

                if (!noCancel) {
                    if (abortPromises.getProducts) {
                        abortPromises.getProducts.resolve();
                    }
                    abortPromises.getProducts = $q.defer();
                }

                paramsExt = this.set_query(paramsExt);
                if (paramsExt.config.params.query) {
                    $http({
                        url: paramsExt.url,
                        method: 'get',
                        params: paramsExt.config.params,
                        timeout: noCancel ? undefined : abortPromises.getProducts.promise
                    }).then(function (data) {
                        var filter = filterProductsByGender(data.data, paramsExt),
                            products = filter.products;
                        //We need the filtered products
                        data.Products = products;
                        if (products.length > 0) {
                            return q.resolve(data);
                        }
                        // there are products matching the gender and possible brand
                        if (filter.genderMatchedInFacet) {
                            paramsExt.config.params.fq = filter.emergencyFilterQuery;
                            return $http({
                                url: paramsExt.url,
                                method: 'get',
                                params: paramsExt.config.params,
                                timeout: noCancel ? undefined : abortPromises.getProducts.promise
                            }).then(function (data) {
                                q.resolve(data);
                            }, function (data, status) {
                                q.reject(status);
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                            });
                        }
                        q.resolve(data);
                    }, function (data, status) {
                        q.reject(data);
                    });
                } else {
                    q.resolve(data);
                }
                return q.promise;
            };
        }
    ]);
});
