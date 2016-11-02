(function() {
    'use strict';

    angular
        .module('shiptApp')
        .factory('shopCategoriesProvider', shopCategoriesProvider);

    shopCategoriesProvider.$inject = [
        '$rootScope',
        '$ionicPopover',
        '$q'];

    /* @ngInject */
    function shopCategoriesProvider($rootScope,
                                    $ionicPopover,
                                    $q) {

        var popover = null;
        function getPopover($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/shop/webMenus/shopCategories/shopCategories.html';
            $ionicPopover.fromTemplateUrl(tpl, {
                scope: $scope
            }).then(function(_popover) {
                defer.resolve(_popover);
            });
            return defer.promise;
        }


        var init = function($scope, $event, categories) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.categories = categories;
            getPopover($scope)
                .then(function(_popover){
                    popover = _popover;
                    popover.show($event);
                    $('.category-heading').focus();
                });
            $scope.closePopover = function(){
                defer.reject();
                popover.hide();
                popover = null;
            };

            return defer.promise;
        };

        var service = {
            show: init
        };

        return service;

    }
})();
