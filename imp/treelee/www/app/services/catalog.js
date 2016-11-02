/*global define*/
define([
    'app',
    'angular',
    'services/request'
], function (app, angular) {

    'use strict';

    app.service('catalogService', [
        'requestService',
        function (requestService) {
            var filterURI = '';

            this.categories = [];

            this.activeCategory = {};
            this.activeProducts = [];
            this.activeFilter = [];
            this.chosenFilterLength = '';

            function setSubcategories(parent, children) {
                var i = 0;

                // if parent has subcategories
                if (children[parent.entity_id]) {
                    parent.children = children[parent.entity_id];

                    // foreach subcategory -> get subcategories
                    for (i; i < parent.children.length; i = i + 1) {
                        setSubcategories(parent.children[i], children);
                    }
                }
            }

            function categoryWalk(categories) {
                var category,
                    i = 0,
                    j = 0,
                    roots = [],
                    children = {};

                // build up parents and children
                for (i; i < categories.length; i = i + 1) {
                    category = categories[i];

                    // check if category has no parent or parent is default root shop category
                    if (!category.parent_id || category.parent_id === category.level) {
                        roots.push(category);
                    } else {
                        // if children key does not exist -> create empty array
                        if (!children[category.parent_id]) {
                            children[category.parent_id] = [];
                        }
                        children[category.parent_id].push(category);
                    }
                }

                // for each root / parent category build up subcategories
                for (j; j < roots.length; j = j + 1) {
                    setSubcategories(roots[j], children);
                }

                return roots;
            }

            // get all categories
            this.get = function () {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/catalog/category',
                    success: function (res, promise) {
                        var categories = res && res.category && res.category.items ? res.category.items.item : [];

                        // store categories
                        self.categories = categoryWalk(categories);

                        promise.resolve(self.categories);
                    }
                });
            };

            this.getFilter = function (categoryId) {
                var self = this;

                return requestService.send({
                    method: 'get',
                    url: '/catalog/filters/category_id/' + categoryId,
                    success: function (res, promise) {
                        var filters = res && res.category && res.category.filters && res.category.filters ? res.category.filters : undefined,
                            filter = [],
                            i = 0;

                        if (filters && filters.item) {
                            if (angular.isArray(filters.item)) {
                                filter = filters.item;
                            } else if (angular.isObject(filters.item)) {
                                filter = [filters.item];
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

                        self.activeFilter = filter;

                        promise.resolve(filter);
                    }
                });
            };

            this.getProducts = function (categoryId, filter, timeoutPromise) {
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

                //new category request
                if ((self.activeCategory && categoryId !== self.activeCategory.category_id) || (newFilterURI !== filterURI)) {
                    filterURI = newFilterURI;
                    self.activeCategory = {};
                    self.activeProducts = [];
                }

                return requestService.send({
                    method: 'get',
                    url: '/catalog/category/id/' + categoryId + '/offset/' +  self.activeProducts.length + '/count/' + 40 + filterURI,
                    timeout: timeoutPromise ? timeoutPromise.promise : undefined,
                    success: function (res, promise) {
                        var items = [],
                            tmpItems = [],
                            category = res && res.category ? res.category : undefined;

                        if (category) {
                            if (category.category_info) {
                                self.activeCategory = category.category_info;
                            }
                            if (category.products && category.products.item) {
                                tmpItems = category.products.item;

                                if (angular.isArray(tmpItems)) {
                                    items = tmpItems;
                                } else if (angular.isObject(tmpItems)) {
                                    items.push(tmpItems);
                                }
                            }
                        }

                        self.activeProducts = self.activeProducts.concat(items);

                        promise.resolve(self.activeProducts);
                    }
                });
            };
        }
    ]);
});