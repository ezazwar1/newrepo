angular.module('corso.factories', [])
.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})

.factory('$localstorage', ['$window', function($window) {
  return {
    deleteKey: function(key) {
      	$window.localStorage.removeItem(key);
    },
		deleteAll: function() {
			$window.localStorage.clear();
		},
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || null);
    }
  }
}])
.factory ('headerIconsService', function($localstorage, $rootScope, WishlistCoutService, CartCoutService, SyncService) {
  return {
      getIconStatuses: function () {
        if ($localstorage.getObject('wishlist') === null) {
          $rootScope.wishlistStatusFull = 0;

        } else {
          if ($localstorage.getObject('account') != null) {
            SyncService.wishlist();
          }
          $rootScope.wishlistStatusFull = 1;
          $rootScope.wishlistCount = WishlistCoutService.getWishlistCount();
        }
        if ($localstorage.getObject('shoppingCart') === null) {
          $rootScope.shoppingCartStatusFull = 0;
        } else {
          var cart = $localstorage.getObject('shoppingCart');
          if(cart.items.length == 0){
            $rootScope.shoppingCartStatusFull = 0;
            $localstorage.deleteKey('shoppingCart');
          }else {
          $rootScope.shoppingCartStatusFull = 1;
          $rootScope.CartCount = CartCoutService.getCartCount();
        }
        }
      }
  };

})

.factory('SyncService', function($http, $localstorage) {
  return {
      wishlist: function () {
      //  console.log(angular.toJson($localstorage.getObject('wishlist')));
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/syncWishlist',key:'12Server34', customer_id:$localstorage.getObject('account').customer_id, wishlist: $localstorage.getObject('wishlist').toString() } })
      }
  };
})

.factory( 'TokenService', function($http, $localstorage) {
  return {
    sendOnlyToken: function (token) {
        return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/sendusertoken',key:'12Server34', token: token} })
    },
      sendUserTokenFull: function (token) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/sendusertoken',key:'12Server34', customer_id: $localstorage.getObject('account').customer_id, token: token, device :$localstorage.getObject('deviceInfo').device, model : $localstorage.getObject('deviceInfo').model, platform : $localstorage.getObject('deviceInfo').platform, uuid : $localstorage.getObject('deviceInfo').uuid, version : $localstorage.getObject('deviceInfo').version  } })
      },

          sendUserToken: function (customer_id, token ) {
              return $http.get('https://corsocomo.com/', {
                    params: {
                      route: 'feed/web_api/sendusertoken',
                      key: '12Server34',
                      customer_id: customer_id, token: token } })
          },
      sendToken: function (token) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/sendusertoken',key:'12Server34', token: token, device :$localstorage.getObject('deviceInfo').device, model : $localstorage.getObject('deviceInfo').model, platform : $localstorage.getObject('deviceInfo').platform, uuid : $localstorage.getObject('deviceInfo').uuid, version : $localstorage.getObject('deviceInfo').version  } })
      },
      sendPushReceiveConf: function (token , push) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/sendreadpushconfirm',key:'12Server34', token: token, push: push  } })
      },
  };
})
/*.factory('adressesService', function($http) {
  return {
      getadresses: function (customer_id) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/getAdresses',key:'12Server34', customer_id: customer_id } })
      },
      getadress: function (adress_id) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/getAdress',key:'12Server34', adress_id: adress_id } })
      }
  };
})*/
.factory('deliveryCostService', function($http) {
  return {
      getcost: function (zone_id, country_id) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/getShippingMethods',key:'12Server34', country_id: country_id, zone_id: zone_id } })
      }
  };
})
.factory('forgotPassService', function($http) {
  return {
      getPass: function (mail) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/forgotPassword',key:'12Server34', email: mail } })
      }
  };
})
.factory('menuService', function($http) {
	var menu = [];

	return {
		getMenu: function(){

        return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/returnMenu',key:'12Server34' } }).then(function(response){

				menu = response.data;
                               // console.log(menu);
				return menu;
			});
		}
	}
})
.factory('barcodeService', function($http) {

	return {
		searchBarcode: function(barcode){
        return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/returnQuantityByBarcode',key:'12Server34',barcode: barcode} }).then(function(response){

				barcodeResult = response.data;
                               // console.log(menu);
				return barcodeResult;
			});
		},

		getId: function(barcode){
        return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/returnIdByBarcode',key:'12Server34',barcode: barcode} }).then(function(response){
				barcodeResult = response.data;
				return barcodeResult;
			});
		}
}
})

.factory('productAvaliableService', function($http) {
	var quantity = [];
  return {
      getProducts: function (art) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/returnQuantity',key:'12Server34',art: art} }).then(function(response){
    				quantity = response.data;
    				return quantity;
    			});
      }, getProductsDefect: function (art) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/returnQuantityWithDefect',key:'12Server34',art: art} }).then(function(response){
    				quantity = response.data;
    				return quantity;
    			});
      }

  };
/*return {
		getProducts: function(art){
			return $http.get("https://passbook.corsocomo.ru/shop/returnQuantity/"+art).then(function(response){
				quantity = response.data;

				return quantity;
			});
		}
	}*/
})

.factory('couponService', function($http) {

  return {
    /*  applyCoupon: function (coupon, products, customer_id) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/couponApply',key:'12Server34',coupon: coupon, products:products, customer_id : customer_id} });
      },*/
      applyCoupon: function (data) {
            return $http.post('https://corsocomo.com/?route=feed/web_api/couponApply&key=12Server34', { data: data } )
      }
  }
})

.factory('searchService', function ($http, $rootScope, $stateParams) {
  return {
      getInfo: function () {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/search',key:'12Server34',search: $stateParams.searchString } })
      }
  };
})
.factory('productInfoService', function ($http, $rootScope, $stateParams) {
  return {
      getInfo: function () {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/product',key:'12Server34',id: $stateParams.itemId } })
      }
  };
})
.factory('cartInfoService', function ($http, $rootScope) {
  return {
      getProduct: function (product_id, option_value_id) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/cartProduct',key:'12Server34',product_id: product_id, option_value_id: option_value_id } })
      }
  };
})
.factory('OrderService', function ($http ) {
  return {
      addOrder: function (data) {
            return $http.post('https://corsocomo.com/?route=feed/web_api/addOrder&key=12Server34', { data: data } )
      }
  };
})
.factory('wishlistService', function ($http ) {
  return {
      getWishlist: function (list) {
            return $http.post('https://corsocomo.com/?route=feed/web_api/wishlist&key=12Server34', { list: list } )
      }
  };
})
.factory('registerAccountService', function ($http ) {
  return {
      register: function (data) {
            return $http.post('https://corsocomo.com/?route=feed/web_api/registration&key=12Server34', { data: data } )
      }
  };
})
.factory('getRegionsService', function ($http ) {
  return {
      getZones: function (country_id) {
          return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/getZones',key:'12Server34',country_id: country_id } })

      }
  };
})

.factory('productImages', function($http) {
	var images = [];

	return {
		getImages: function(art){
			return $http.get("https://passbook.corsocomo.ru/shop/returnImages/"+art).then(function(response){
				images = response.data;

				return images;
			});
		}
	}
})
.factory('productImagesByBarcode', function($http) {
	var images = [];

	return {
		getImages: function(barcode){
			return $http.get("https://passbook.corsocomo.ru/shop/returnImagesByBarcode/"+barcode).then(function(response){
				images = response.data;

				return images;
			});
		}
	}
})
.factory('productSearch', function($http) {
	var products = [];

	return {
		getProducts: function(art){
			return $http.get("https://passbook.corsocomo.ru/shop/search/"+art).then(function(response){
				products = response.data;

				return products;
			});
		}
	}
})
.factory('getProductById', function($http) {
	var product = [];
	return {
		getProduct: function(product_id){
			return $http.get("https://corsocomo.com/?route=feed/web_api/product&key=12Server34&id="+product_id).then(function(response){
				product = response;
			console.log('start_service');
				return product;

			});
		}
	}
})
.factory('productListService', function($http) {
	var products = [];

	return {
		getProducts: function(category, sort, order){
      return $http.get('https://corsocomo.com/', { params: { route:'feed/web_api/products',key:'12Server34',category: category, sort: sort, order:order } })

	     .then(function(response){

				products = response.data;
                                //console.log(products);
				return products;
			});
		}
	}
});
