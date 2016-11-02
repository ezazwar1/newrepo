/**
 * Created by Shipt
 */


(function () {
    'use strict';

    angular.module('shiptApp').controller('SubCategoriesController', [
        '$scope',
        '$state',
        'ShoppingService',
        '$stateParams',
        'UIUtil',
        'LogService',
        'AccountService',
        'KahunaService',
        SubCategoriesController]);

    function SubCategoriesController($scope,
                                     $state,
                                     ShoppingService,
                                     $stateParams,
                                     UIUtil,
                                     LogService,
                                     AccountService,
                                     KahunaService) {

        $scope.dataLoaded = false;

        $scope.guest_account= function(){
            return AccountService.isCustomerGuest();
        };

        $scope.doRefresh = function() {
            ShoppingService.getSubCategories($scope.parentCat,true)
                .then(function(data){
                    $scope.subCategories = data.categories;
                    $scope.$broadcast('scroll.refreshComplete');
                }
                ,function(error){
                    LogService.error({
                        message: 'getSubCategories error',
                        error:error
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        var loadData = function(){
            $scope.parentCat = angular.fromJson($stateParams.parentCat);
            $scope.title = $scope.parentCat.name;
            KahunaService.viewCategory($scope.title);
        };

        var loadSubCategories = function () {
            ShoppingService.getSubCategories($scope.parentCat, true)
                .then(function(data){
                    $scope.subCategories = data.categories;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.dataLoaded = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                ,function(error){
                    UIUtil.showErrorAlert('Error loading categories.')
                });
        };

        $scope.loadMoreItems = function() {
            loadSubCategories();
        };

        $scope.showProducts = function(subCat) {
            if(hasSubCategories(subCat)){
                $state.go('app.subcategories', {parentCat: angular.toJson(subCat)});
            } else {
                $state.go('app.products', {category: angular.toJson(subCat)});
            }
        };

        function hasSubCategories(subCat = {}){
            try {
                return subCat.categories && subCat.categories.length > 0;
            } catch (e) {
                return false;
            }
        }

        $scope.moreDataCanBeLoaded = function() {
            if($scope.dataLoaded){
                return false;
            } else {
                return true;
            }
        };

        loadData();

    };
})();
