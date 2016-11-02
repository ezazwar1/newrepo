'use strict';

angular.module('shop.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('app.menu.shop', {
                url: '/shop',
                abstract: true,
                views: {
                    'tab-shop': {
                        templateUrl: 'app/shop/templates/layout.html'
                    },
                    'menu': {
                        templateUrl: 'app/shop/templates/layout.html'
                    }
                }
            })
        .state('app.menu.shop.home', {
            url: '/home',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-list.html',
                    controller: 'ShopHomeCtrl'
                }
            }
        })
        .state('app.menu.shop.item', {
            url: '/item/:id',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-item.html',
                    controller: 'ShopItemCtrl'
                }
            }
        })
        .state('app.menu.shop.search', {
            url: '/search',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-search.html',
                    controller: 'ShopSearchCtrl'
                }
            }
        })
        .state('app.menu.shop.category', {
            url: '/category/:id',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-category.html',
                    controller: 'ShopCategoryCtrl'
                }
            }
        })
    });

/**
* @ngdoc directive
* @name shop.module.directive:fileread
* @description
* Reads a file selected in a file input and add to the scope.
* @example
<pre>
<input type="file" ng-model="cart.options[option.product_option_id]" fileread="cart.options[option.product_option_id]" >
</pre>
*/
angular.module('shop.module').directive("fileread", ['dataService', '$ionicLoading', function (dataService, $ionicLoading) {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind('change', function () {
                scope.$apply(function () {
                    $ionicLoading.show();
                    dataService.apiFilePost("/upload", element[0].files[0]).then(function (data) {
                        $ionicLoading.hide();
                        if (data.success)
                            alert(data.success);
                        scope.fileread = data.code;
                    }, function (data) {
                        $ionicLoading.hide();
                        alert(data.error);
                    })
                });
            });
        }
    }
}]);

/**
* @ngdoc directive
* @name shop.module.directive:filterBox
* @description
* Renders a search filter box.
* @example
<pre>
<filter-box placeholder="Search" filtertext="vm.search" ng-model-options="{debounce: 1000}"></filter-box>
</pre>
*/
angular.module('shop.module').directive('filterBox', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: '=?',
            search: '=?filtertext',
            change: '=?change'
        },
        link: function (scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = { value: '' };

            scope.clearSearch = function () {
                scope.search.value = "";
                scope.change();
            };
        },
        template: ' <div id="filter-box" class="item-input-inset">' +
                        '<div class="item-input-wrapper">' +
                            '<i class="icon ion-android-search"></i>' +
                            '<input type="search" placeholder="{{placeholder}}" style="width: 100%;" ng-model="search.value" ng-change="change()">' +
                        '</div>' +

                        '<button class="button button-clear ion-close button-small" style="color: #333" ng-if="search.value.length > 0" ng-click="clearSearch()">' +
                        '</button>' +
                    '</div>'
    };
})