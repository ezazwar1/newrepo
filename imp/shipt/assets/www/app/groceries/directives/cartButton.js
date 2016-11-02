angular
    .module('shiptApp')
    .directive('cartButton', ['$timeout','$state','ShoppingCartService',cartButton]);

function cartButton($timeout,$state,ShoppingCartService) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template:
        `<button class="button button-icon icon ion-ios-cart-outline" ng-click="goToCart()" role="button" aria-label="Cart, {{cartCount()}} items.">
            <span aria-hidden="true" ng-if="cartCount() > 0" class="badge badge-assertive magictime cart-count {{animatedClass}}">{{cartCount()}}</span>
        </button>`,
        link: function(scope, element, attrs) {
            scope.goToCart = function(){
                $state.go('app.shoppingCart');
            };
            scope.cartCount = function(){
                return ShoppingCartService.getCartItemCount();
            };
            scope.$watch(
                function () {
                    return scope.cartCount();
                },
                function( newValue, oldValue ) {
                    if(oldValue){
                        if(oldValue < newValue) {
                            scope.animatedClass = 'puffIn';
                        } else {
                            scope.animatedClass = 'puffOut';
                        }
                        $timeout(function() {
                            scope.animatedClass = '';
                        }, 200);
                    }

                }
            );
        },
        scope: { value: '='},
    };
    return directive;
}
