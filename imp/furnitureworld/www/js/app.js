// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
 'starter.controllers',
  'starter.services',
  'starter.directives',
  'sir-accordion',
  //'ui.bootstrap',
  //'ui.bootstrap.modal',
  'ionicShop',
  'ionic-datepicker',
  'ngCordova',
  'ngStorage',
  'ngMessages'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  //--default clase for the currency vairable
  $rootScope.currencyIcon = 'ion-social-usd';
})

// Modal State Provider for nested modal
.provider('modalState', function($stateProvider) {
    var provider = this;
    this.$get = function() {
        return provider;
    }
    this.state = function(stateName, options) {
        var modalInstance;
        $stateProvider.state(stateName, {
            url: options.url,
            onEnter: function($modal, $state) {
                modalInstance = $modal.open(options);

                modalInstance.result['finally'](function() {
                    modalInstance = null;
                    console.log($state.$current.name,stateName);
                    if ($state.$current.name === stateName) {
						alert("goback");
                        $state.go('^');
                    }
                });

            },
            onExit: function() {
                if (modalInstance) {
                    modalInstance.close();
                }
            }
        });
    };

})


.config(function($stateProvider,modalStateProvider,$urlRouterProvider,$ionicConfigProvider) {


  if (ionic.Platform.isAndroid())$ionicConfigProvider.scrolling.jsScrolling(false);

  $ionicConfigProvider.navBar.alignTitle('center');
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'js/dashboard/dashboard.html',
		controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.categories', {
    cache:false,
      url:'/categories/:catid',
      views: {
        'menuContent': {
          templateUrl: 'js/products/products_banner.html',
		  controller: 'Products_bannerCtrl'
        }
      }
    })

		.state('app.products', {
      cache:false,
      url: '/products/:catid/:catName',
      views: {
        'menuContent': {
          templateUrl: 'js/products/product_list.html',
		  controller: 'ProductListCtrl'
        }
      }
    })

		.state('app.productslistdetail', {
      cache:false,
      url: '/productdetail/:prId/:catid/:catName',
      views: {
        'menuContent': {
          templateUrl: 'js/products/product_detail.html',
		  controller: 'ProductDetailCtrl'
        }
      }
    })

    //------------------
    .state('app.shopping-cart', {
   	cache:false,
       url: '/shopping-cart',
       views: {
         'menuContent': {
           templateUrl: 'js/cart/cart.html',
           controller: 'CartCtrl'
         }
       }
     })

     .state('app.delivery-address', {
     cache:false,
        url: '/delivery-address',
        views: {
          'menuContent': {
            templateUrl: 'js/cart/delivery-address.html',
            controller: 'CartDeliveryCtrl'
          }
        }
      })

      .state('app.delivery-options', {
     cache:false,
        url: '/delivery-options',
        views: {
          'menuContent': {
            templateUrl: 'js/cart/delivery-options.html',
            controller: 'CartOptionsCtrl'
          }
        }
      })

     .state('app.shipping-address', {
  cache:false,
     url: '/shipping-address',
     views: {
       'menuContent': {
         templateUrl: 'js/cart/shipping-address.html',
         controller: 'CartDeliveryCtrl'
       }
     }
   })







    .state('app.place-order', {
     cache:false,
        url: '/place-order',
        views: {
          'menuContent': {
            templateUrl: 'js/cart/place-order.html',
            controller: 'CartOrderCtrl'
          }
        }
      })

    .state('app.order-status', {
     cache:false,
        url: '/order-status/:status_id',
        views: {
          'menuContent': {
            templateUrl: 'js/cart/order-status.html',
            controller: 'CartOrderStatusCtrl'
          }
        }
      })
      //---------------------------
      .state('app.orders', {
     	cache:false,
         url: '/orders',
         views: {
           'menuContent': {
             templateUrl: 'js/orders/orders.html',
             controller: 'OrdersCtrl'
           }
         }
       })
       .state('app.editpasswordpage', {
         url: '/changepassword',
         views: {
           'menuContent': {
             templateUrl: 'js/changepassword/edit-password.html',
     		controller: 'EditpasswordCtrl'
           }
         }
       })

       .state('app.profile', {
         url: '/profile',
         views: {
           'menuContent': {
             templateUrl: 'js/profile/profile.html',
     		controller: 'ProfileCtrl'
           }
         }
       })
       .state('app.search', {
         url: '/search',
         views: {
           'menuContent': {
             templateUrl: 'templates/modules/search.html',
     		controller: 'SearchCtrl'
           }
         }
       })
		;
  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/app/dashboard');
   modalStateProvider.state('app.dashboard.search', {
        url: '/search',
        templateUrl: 'templates/modules/search.html',
        controller: 'SearchCtrl'
    });
    modalStateProvider.state('app.dashboard.search.modal2', {
        url: '/modal2',
        templateUrl: 'modal2.html'
    });
});
Array.prototype.getIndexBy = function (name, value) {
for (var i = 0; i < this.length; i++) {
    if (this[i][name] == value) {
        return i;
    }
}
return -1;
}
