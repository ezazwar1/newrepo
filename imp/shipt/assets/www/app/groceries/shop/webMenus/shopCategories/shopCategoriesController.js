
(function() {
    'use strict';

    angular
        .module('shiptApp')
        .controller('shopCategoriesController', shopCategoriesController);

    shopCategoriesController.$inject = [
        '$scope',
        '$state',
        'ShoppingService'
    ];

    function shopCategoriesController(
        $scope,
        $state,
        ShoppingService
    ) {
        var vm = this;

        activate();

        function activate() {
            vm.categories = $scope.categories;
            if(!vm.categories) {
                ShoppingService.getCategories()
                    .then(function(cats){
                        vm.categories = cats;
                    })
            }
        };

        vm.yourRecentItemsClick = function() {
            $state.go('app.recentProducts');
            $scope.closePopover();
        };

        vm.categoryClick = function(category) {
            $state.go('app.products', {category: angular.toJson(category)});
            $scope.closePopover();
        };

        vm.closeClick = function() {
            $scope.closePopover();
        };

        vm.saleCategoryClick = function(){
            try {
                var saleCat = vm.categories.find(x => x.name == 'On Sale');
                vm.categoryClick(saleCat);
            } catch (e) {
                LogService.error(e);
            }
        };
    }
})();
