/*global define*/
define([
    'angular',
    'app',
    'services/request'
], function (angular, app) {

    'use strict';

    app.service('productService', [
        'requestService',
        function (requestService) {
            var filterURI = '';

            this.containerHeight = 0;
            this.containerWidth = 0;
            this.products = [];
            this.query = null;

            // get product details
            this.get = function (productId) {
                return requestService.send({
                    method: 'get',
                    url: '/catalog/product/id/' + productId,
                    success: function (res, promise) {
                        var product = res && res.product ? res.product : undefined,
                            options = product && product.has_options && product.product && product.product.options && product.product.options.option ? product.product.options.option : undefined,
                            related_products = product && product.related_products && product.related_products.item ? product.related_products.item : [],
                            additional_attributes = product && product.additional_attributes && product.additional_attributes.item ? product.additional_attributes.item : [],
                            i = 0,
                            j = 0;

                        // Check if options is object or array -> if object put it in an array
                        if (options) {
                            if (angular.isArray(options)) {
                                product.options = options;
                            } else if (angular.isObject(options)) {
                                product.options = [options];
                            }
                        }

                        // Check if option values is only object -> put it in an array
                        if (product) {
                            if (product.options) {
                                for (i; i < product.options.length; i = i + 1) {
                                    if (!angular.isArray(product.options[i].value)) {
                                        product.options[i].value = [product.options[i].value];
                                    }
                                    for (j; j < product.options[i].value.length; j = j + 1) {
                                        if (product.options[i].value[j].relation) {
                                            if (!angular.isArray(product.options[i].value[j].relation.value)) {
                                                product.options[i].value[j].relation.value = [product.options[i].value[j].relation.value];
                                            }
                                        }
                                    }
                                }
                            }

                            // Check if related_products is only object -> put it in an array
                            if (angular.isArray(related_products)) {
                                product.related_products = related_products;
                            } else if (angular.isObject(options)) {
                                product.related_products = [related_products];
                            }

                            // Check if additional_attributes is only object -> put it in an array
                            if (angular.isArray(additional_attributes)) {
                                product.additional_attributes = additional_attributes;
                            } else if (angular.isObject(additional_attributes)) {
                                product.additional_attributes = [additional_attributes];
                            }

                            if (product.has_gallery && product.gallery_images) {
                                if (!angular.isArray(product.gallery_images)) {
                                    product.gallery_images = [product.gallery_images];
                                }
                            }
                        }

                        promise.resolve(product);
                    }
                });
            };

            this.search = function (query, filter, initialized, timeoutRequest) {
                var self = this,
                    key,
                    newFilterURI = '';

                // build up filter string
                if (filter) {
                    for (key in filter) {
                        if (filter.hasOwnProperty(key)) {
                            newFilterURI = newFilterURI + '/' + key + '/' + filter[key];
                        }
                    }
                }

                //new query
                if ((self.query && (query !== self.query)) || (newFilterURI !== filterURI)) {
                    filterURI = newFilterURI;
                    self.products = [];
                }

                //go back from detail view
                if (initialized) {
                    if (self.products.length > 40) {
                        self.products.splice(-40, 40);
                    } else {
                        self.products = [];
                    }
                }

                return requestService.send({
                    method: 'get',
                    url: '/catalog/search/query/' + decodeURIComponent(query) + '/offset/' + self.products.length + '/count/40' + filterURI,
                    timeout: timeoutRequest ? timeoutRequest.promise : undefined,
                    success: function (res, promise) {
                        var items = [],
                            tmpItems = [],
                            search = res && res.search ? res.search : undefined,
                            i = 0;

                        filter.length = 0;

                        self.query = query;

                        if (search.products && search.products.item) {
                            tmpItems = search.products.item;
                            if (angular.isArray(tmpItems)) {
                                items = tmpItems;
                            } else if (angular.isObject(tmpItems)) {
                                items.push(tmpItems);
                            }
                        }

                        if (search && search.filters && search.filters.item) {
                            if (angular.isArray(search.filters.item)) {
                                filter = search.filters.item;
                            } else if (angular.isObject(search.filters.item)) {
                                filter = [search.filters.item];
                            }
                        }

                        if (filter.length) {
                            for (i; i < filter.length; i = i + 1) {
                                if (filter[i].values && filter[i].values.value) {
                                    if (angular.isArray(filter[i].values.value)) {
                                        filter[i].values = filter[i].values.value;
                                    } else if (angular.isObject(filter[i].values.value)) {
                                        filter[i].values = [filter[i].values.value];
                                    }
                                } else {
                                    delete filter[i];
                                }
                            }
                        }

                        self.filter = filter;
                        self.products = self.products.concat(items);

                        promise.resolve({
                            products: self.products,
                            hasMoreItems: search['@attributes'] && search['@attributes'].has_more_items && search['@attributes'].has_more_items === '1' ? true : false,
                            filter: filter
                        });
                    }
                });
            };
        }
    ]);
});
