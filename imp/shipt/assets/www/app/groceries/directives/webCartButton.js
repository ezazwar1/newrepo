angular
    .module('shiptApp')
    .directive('webCartButton', ['UIUtil','$ionicHistory','$state','ErrorHandler','$rootScope','ShoppingCartService',webCartButton]);

function webCartButton(UIUtil,$ionicHistory,$state,ErrorHandler,$rootScope,ShoppingCartService) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template:
        `<button class="button button-icon icon ion-ios-cart" ng-click="cartClick()"
            aria-label="Cart balance, {{cartAmount() | number:0}} dollars. Click to open cart">
            {{cartAmount() | currency}}
        </button>`,
        link: function(scope, element, attrs) {

            scope.cartClick = function(){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.shoppingCart');
            };

            scope.cartAmount = function() {
                try {
                    var total = ShoppingCartService.getCartTotal();
                    return total;
                } catch (exception) {
                }
            };

        },
        scope: { value: '='},
    };
    return directive;
}
