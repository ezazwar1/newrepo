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
                'url': 'http://sapi.edelight.biz/api/',
                'config': {
                    'params': {
                        'AccessKey': '316db64d71e8f1386e762fe9e22d9114',
                        'Operation': 'ItemSearch',
                        'Output': 'JSON',
                        'Items': 50,
                        // You can sort by ‘title’, ‘price’, ‘random’, ‘ein’, ‘score’, ‘created’, ‘modified’, ‘price_old’. Prefix “+” or a “-” to specify ascending or descending order.
                        'Sort': 'score',
                        'SimilarColor': 'true',
                        //'Color': 'C4DEFF',
                        //'Color': 'ADD8E6'
                        //'publisherId': '717588',
                        //'Password': '1qepbvxTvhWBBi3Kmp4J',
                        //'PageSize': 500,
                        //'SortBy': 'Score',
                        //'ImageScales': 'Image120,OriginalImage',
                        //'facetFields': 'Property_CF_gender,Property_CF_Gender,Property_CF_geschlecht,Property_CF_diviv'
                    }
                }
            };

            this.set_query = function (paramsExt) {
                var clothescategory = $rootScope.dict.clothes.subcategories[paramsExt.clothes][paramsExt.name],
                    querystring = clothescategory.search,
                    typedTags = '',
                    genderTag = 'gender:("' + paramsExt.gender + '")',
                    colorTag = '',
                    brandTag = '',
                    ecatn = '',
                    self = this;

                self.params.config.params.Sort = paramsExt.sort || 'score';

                if (clothescategory.ecatn) {
                    //eactn = clothescategory.eactn;
                    ecatn = ' AND ecatn:(' + clothescategory.ecatn + ')';
                }
                if ($rootScope.dict.colors[paramsExt.color].hex){
                    paramsExt.config.params.Color = $rootScope.dict.colors[paramsExt.color].hex;
                    colorTag = '';
                } else {
                    colorTag = ' AND color:("' + $rootScope.dict.colors[paramsExt.color].search + '")';
                    delete paramsExt.config.params.Color;
                }

                if (paramsExt.brand) {
                    brandTag = ' AND brand:("' + paramsExt.brand + '")';
                }

                typedTags = '(' + genderTag + brandTag + ecatn + colorTag + ' AND agegroup:("adults"))';
                paramsExt.config.params.TypedTags = typedTags;
                paramsExt.config.params.Query = querystring;
                return paramsExt;
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
                //if (paramsExt.config.params.Query) {
                    $http({
                        url: paramsExt.url,
                        method: 'get',
                        params: paramsExt.config.params,
                        timeout: noCancel ? undefined : abortPromises.getProducts.promise
                    }).then(function (data) {
                        var products = data.data.itemsearchresponse.items.item;

                        angular.forEach(products, function(product) {
                            product.image = product.imagebaseurl + 'resized/normal/220/'+ product.ein + '.jpg';
                        });

                        data.Products = products;
                        if (products.length > 0) {
                            return q.resolve(data);
                        }

                        q.resolve(data);
                    }, function (data, status) {
                        q.reject(data);
                    });
                //} else {
                //    q.resolve(data);
                //}
                return q.promise;
            };
        }
    ]);
});
