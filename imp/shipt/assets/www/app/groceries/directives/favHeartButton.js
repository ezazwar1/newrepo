angular
    .module('shiptApp')
    .directive('favHeartButton', ['UIUtil','choosePlan','Subscription','ErrorHandler','$rootScope','FavoriteItem','FeatureService',favHeartButton]);

function favHeartButton(UIUtil,choosePlan,Subscription,ErrorHandler,$rootScope,FavoriteItem,FeatureService) {
    var guestAccount = false;

    var directive = {
        restrict: 'EA',
        template:
        '<button ng-if="showFavButton" class="button button-clear button-assertive fav-button" ng-click="clickFavorite(productDetailProduct)" aria-label="add to favorites icon in top left">'+
            '<i class="icon text-assertive" ng-class="favClass()"></i>' +
        '</button>',
        link: function(scope, element, attrs) {
            var favoriteIds = [];
            loadFavIds();

            function loadFavIds() {
                FavoriteItem.listIds()
                    .then(function(fav_ids){
                        favoriteIds = fav_ids;
                    })
            }

            function removeFromParent() {
                try {
                    scope.$parent.productUnFavoritedRemove(scope.productDetailProduct);
                } catch (e) {

                }
            }

            scope.showFavButton = FeatureService.favorites();

            scope.clickFavorite = function(product){
                if(product.favorite){
                    FavoriteItem.removeProduct(product);
                    //set it to not be a favorite and remove it from the local copy of the fav item ids
                    scope.productDetailProduct.favorite = false;
                    favoriteIds = favoriteIds.filter(item => item.id != scope.productDetailProduct.id);
                    removeFromParent();
                } else {
                    FavoriteItem.addProduct(product);
                    //set it to be a favorite and add it to the local copy of the fav item ids
                    favoriteIds.push({id: product.id});
                    scope.productDetailProduct.favorite = true;
                    loadFavIds()
                }
            }

            scope.favClass = function() {
                try {
                    if(scope.productDetailProduct.product_type == "custom"){
                        return '';
                    }
                    var foundFav = favoriteIds.find(item => item.id == scope.productDetailProduct.id);
                    if(foundFav) {
                        scope.productDetailProduct.favorite = true;
                        return 'ion-ios-heart';
                    } else {
                        return scope.productDetailProduct.favorite ? 'ion-ios-heart' : 'ion-ios-heart-outline';
                    }
                } catch (e) {
                    return 'ion-ios-heart-outline';
                }
            }

        },
        scope: {productDetailProduct:"="},
    };
    return directive;
}
