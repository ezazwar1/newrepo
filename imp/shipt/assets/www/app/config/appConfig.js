
angular.module('shiptApp').factory('$exceptionHandler', ['$injector', function($injector) {
    return function(exception, cause) {
        try {
            var LogService = $injector.get("LogService");
            LogService.error(exception);
        } catch (exception) {
            //rollbar was not defined or something.
        }
    };
}])

angular.module('shiptApp').config([
    '$compileProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$ionicConfigProvider',
    'IonicAppConfig',
    function(
        $compileProvider,
        $stateProvider,
        $urlRouterProvider,
        $ionicConfigProvider,
        IonicAppConfig) {

        if(document.location.hostname != "localhost"){
            // $compileProvider.debugInfoEnabled(false);
        }
        //
        // $ionicAppProvider.identify({
        //     // The App ID (from apps.ionic.io) for the server
        //     app_id: IonicAppConfig.ionic_app_id,
        //     // The public API key all services will use for this app
        //     api_key: IonicAppConfig.ionic_api_key,
        // });

        if(webVersion && nonMobileWebApp){
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        var mq = window.matchMedia('all and (max-width: 800px)');
        if(mq.matches) {
            //$ionicConfigProvider.views.transition('none');
        } else {
            $ionicConfigProvider.views.transition('none');
        }

        mq.addListener(function(changed) {
            if(changed.matches) {
                // the width of browser is more then 700px
            } else {
                // the width of browser is less then 700px
            }
        });

        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/menu/webMenu.html" : "app/groceries/menu/menu.html"),
                controller: 'AppController'
            })
            .state('app.shoppingCart', {
                url: "/shoppingCart",
                views: {
                  'menuContent': {
                    templateUrl: ((webVersion && nonMobileWebApp) ?  "app/groceries/shop/shoppingCart/webShoppingCart.html" : "app/groceries/shop/shoppingCart/shoppingCart.html"),
                    controller: "ShoppingCartController"
                  }
                }
            })
            .state('app.products', {
                url: "/products/:category",
                views: {
                  'menuContent': {
                    templateUrl: ((webVersion && nonMobileWebApp) ?  "app/groceries/shop/shopping/webProducts.html" :  "app/groceries/shop/shopping/products.html" ),
                    controller: "ProductsController"
                  }
                }
            })
            .state('app.recentProducts', {
              url: "/recentProducts/",
              views: {
                  'menuContent': {
                      templateUrl: ((webVersion && nonMobileWebApp) ?  "app/groceries/shop/shopping/webProducts.html" :  "app/groceries/shop/shopping/products.html" ),
                      controller: "ProductsController"
                  }
              }
            })
            .state('app.recentSpecialRequests', {
                url: "/recentSpecialRequests/",
                views: {
                    'menuContent': {
                        templateUrl: ((webVersion && nonMobileWebApp) ?  "app/groceries/shop/shopping/webProducts.html" :  "app/groceries/shop/shopping/products.html" ),
                        controller: "ProductsController"
                    }
                }
            })
            .state('app.favoriteItems', {
              url: "/favorites",
              views: {
                  'menuContent': {
                      templateUrl: "app/groceries/shop/shopping/favoriteItems.html",
                      controller: "FavoriteItemsController"
                  }
              }
            })
            .state('app.account', {
                  url: "/account",
                  views: {
                      'menuContent': {
                          templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/account/webAccount.html" : "app/groceries/account/account.html"),
                          controller: "accountController as vm"
                      }
                  }
              })
            .state('app.editAccount', {
                url: "/editAccount/:account",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/account/editAccount.html"
                    }
                }
            })
            .state('app.searchProducts', {
                url: "/searchProducts",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/shop/search/productSearch.html"
                    }
                }
            })
            .state('app.addressList', {
                  url: "/addressList",
                  views: {
                    'menuContent': {
                        templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/account/address/webAddressList.html" :"app/groceries/account/address/addressList.html"),
                        controller: "AddressListController"
                    }
                }
            })
            .state('app.addEditAddress', {
                url: "/addEditAddress/:address/:fromSearch?/:fromCheckout?",
                views: {
                    'menuContent': {
                        templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/account/address/webAddEditAddress.html" : "app/groceries/account/address/addEditAddress.html"),
                        controller: "EditAddressController"
                    }
                }
            })
            .state('app.addEditAddressMap', {
                url: "/addEditAddressMap/:fromCheckout?",
                views: {
                    'menuContent': {
                        templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/account/address/addressSearch/webAddressSearch.html" : "app/groceries/account/address/addressSearch/addressSearch.html")
                    }
                }
            })
            .state('app.cardList', {
              url: "/cardList",
              views: {
                  'menuContent': {
                      templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/account/payment/webCardList.html" : "app/groceries/account/payment/cardList.html"),
                      controller: "CardListController"
                  }
              }
            })
            .state('app.addEditCard', {
              url: "/addEditCard/:card",
              views: {
                  'menuContent': {
                      templateUrl: "app/groceries/account/payment/cardCreate.html",
                      controller: "CardCreateController"
                  }
              }
            })
            .state('app.orders', {
              url: "/orders",
              views: {
                  'menuContent': {
                      templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/account/orders/webOrders.html" : "app/groceries/account/orders/orders.html")
                  }
              }
            })
            .state('app.ordersRate', {
                url: "/ordersRate/:order",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/account/orders/orders.html"
                    }
                }
            })
            .state('app.subcategories', {
              url: "/subcategories/:parentCat",
              views: {
                  'menuContent': {
                      templateUrl: "app/groceries/shop/shopping/subCategories.html",
                      controller: 'SubCategoriesController'
                  }
              }
            })
            .state('app.categories', {
              url: "/categories",
                views: {
                  'menuContent': {
                    templateUrl: "app/groceries/shop/shopping/categories.html"
                  }
                }
            })
            .state('app.checkout', {
              url: "/checkout",
              views: {
                  'menuContent': {
                      templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/shop/checkOut/webCheckout.html" : "app/groceries/shop/checkOut/checkOut.html"),
                      controller: 'CheckoutController as viewModel'
                  }
              }
            })
            .state('app.existingCardDetails', {
              url: "/existingCardDetails:card",
              views: {
                  'menuContent': {
                      templateUrl: "app/groceries/account/payment/existingCardDetails.html",
                      controller: 'ExistingCardDetailsController'
                  }
              }
            })
            .state('app.help', {
                url: "/help",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/help/help.html"
                    }
                }
            })
            .state('app.faq', {
                url: "/faq/:category",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/help/faq/faq.html"
                    }
                }
            })
            .state('app.contactUs', {
                url: "/contactUs",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/help/ContactUs.html"
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: ((webVersion && nonMobileWebApp) ? "app/groceries/home/webHome.html" : "app/groceries/home/home.html")
                    }
                }
            })
            .state('app.faqArticle', {
                url: "/faqArticle/:q",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/help/faq/article.html"
                    }
                }
            })
            .state('app.mealKitsList', {
                url: "/mealKitsList",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/shop/mealKits/mealKitsList.html"
                    }
                }
            })
            .state('app.mealKitDetail', {
                url: "/mealKitDetail/:mealKit",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/shop/mealKits/mealKitDetail/mealKitDetail.html"
                    }
                }
            })
            .state('app.recipes', {
                url: "/recipes",
                views: {
                    'menuContent': {
                        templateUrl: "app/groceries/shop/mealKits/recipes/recipes.html"
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/home');
}]);
