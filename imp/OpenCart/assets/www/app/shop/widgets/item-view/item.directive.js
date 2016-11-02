'use strict';

/**
* @ngdoc directive
* @name shop.module.directive:itemTemplate
* @description
* Widget to render the product template for product lists. 
* @example
<pre>
    <item-template item="item"></item-template>
</pre>
*/
angular.module('shop.module').directive('itemTemplate', function () {
    return {
        restrict: 'E',
        scope: {
            item: '=item'
        },
        controller: ['$scope', '$state', '$ionicPopup', '$ionicLoading', '$ionicTabsDelegate', 'locale', 'ShopService', function ($scope, $state, $ionicPopup, $ionicLoading, $ionicTabsDelegate, locale, ShopService) {

            $scope.addToWishlist = function (id) {
                $ionicLoading.show();
                //add to wishlist
                ShopService.AddToWishlist(id).then(function (data) {
                    var message = "";
                    var title = locale.getString('shop.wishlist_updated');

                    if (data && data.success == 1) {
                        message = locale.getString('shop.wishlist_item_added_to_list');
                    } else if (data && data.success == 2) {
                        message = locale.getString('shop.wishlist_item_added_to_list_login_to_save');
                    } else if (data && data.success == 3) {
                        message = locale.getString('shop.wishlist_item_added_already');
                    }

                    $ionicPopup.show({
                        title: title,
                        template: message,
                        scope: $scope,
                        buttons: [
                          { text: locale.getString('modals.button_cancel') },
                          {
                              text: locale.getString('shop.wishlist_go_to'),
                              type: 'button-positive',
                              onTap: function (e) {
                                  $ionicTabsDelegate.select(3);
                                  $state.go("app.menu.info.home", { redirect: "wishlist" }, { reload: true });
                              }
                          }
                        ]
                    });

                    $ionicLoading.hide();
                }, function (data) {
                    alert("Product not found");
                    $ionicLoading.hide();
                });
            };

        }],
        templateUrl: function ($element, $attrs) {
            var tplUrl = 'app/shop/widgets/item-view/item-template-1.html';
            if ($attrs.mode == "2") {
                var tplUrl = 'app/shop/widgets/item-view/item-template-2.html';
            } else if ($attrs.mode == "3") {
                var tplUrl = 'app/shop/widgets/item-view/item-template-3.html';
            }

            return tplUrl;
        }
    };
});