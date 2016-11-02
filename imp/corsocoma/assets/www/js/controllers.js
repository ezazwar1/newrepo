angular.module('starter.controllers', [])
  .controller('newFeatureCtrl', function($scope, $location, $localstorage, $cordovaGoogleAnalytics, menuService, $ionicScrollDelegate, $ionicPosition) {
    /*Analytics Tracking START*/
    $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };

    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('New feature');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();



  })

.controller('MenuCtrl', function(
    $scope, $location, $timeout, $localstorage, $window, $cordovaGoogleAnalytics,
    menuService, $ionicScrollDelegate, $ionicPosition, headerIconsService, TokenService

  ) {
    $timeout(function() {
      $ionicScrollDelegate.getScrollView().options.animationDuration = 800;
      console.log($ionicScrollDelegate.getScrollView().options);
    });


    scrollToTop = function(element) {
      $ionicScrollDelegate.$getByHandle(element).scrollBy(0, 200, true);
    };
    //начальные состояния иконок корзины и wishlist
    headerIconsService.getIconStatuses();
    $scope.$on('$stateChangeSuccess', function() {
      console.log("State changed: ");
      headerIconsService.getIconStatuses();
    });

    if ($localstorage.getObject('token') != null) {

      if ($localstorage.getObject('account') != null) {
        console.log('account isset!');
        var ccUser = $localstorage.getObject('account');
        console.log('send Token ' + $localstorage.getObject('token'));
        if ($localstorage.getObject('deviceInfo') != null) {
          TokenService.sendUserTokenFull($localstorage.getObject('token'));
        } else {
          TokenService.sendUserToken(ccUser.customer_id, $localstorage.getObject('token'));
        }

      } else {
        console.log('NO account set!');
        if ($localstorage.getObject('deviceInfo') != null) {
          TokenService.sendToken($localstorage.getObject('token'));
        } else {
          TokenService.sendUserToken(null, $localstorage.getObject('token'));
        }
      }


    }

    //searchService.searchPanel();
    $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };
    $scope.searchArt = '';
    $scope.enableSearch = function() {
      console.log($scope.searchArt);
    }
    $scope.clearSearch = function() {
      $scope.searchArt = '';
    }
    $scope.startSearch = function() {

        $location.path("/tab/search/" + $scope.searchArt);
      }
      /*  $scope.scrollToElemet = function(element) {
          var elementPosition = angular.element(document.querySelector(element))

          //var elementPosition = $ionicPosition.position(angular.element('group_id_'+element));

          console.log(elementPosition.offsetHeight);
          // $ionicScrollDelegate.$getByHandle(element).scrollTo(elementPosition.left, elementPosition.bottom, true);
          $ionicScrollDelegate.anchorScroll(element);
        };*/
    $scope.dev_width = $window.innerWidth + 'px';

    $scope.dev_height = $window.innerWidth * .8 + 'px';
    menuService.getMenu().then(function(data) {
      $scope.groups = data;
      //console.log(data);

    });
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function(group, group_id) {
      if ($scope.isGroupShown(group)) {

        $scope.shownGroup = null;
      } else {
        scrollToTop(group_id);
        $scope.shownGroup = group;
      }
    };
    $scope.toggleSubGroup = function(item) {
      if ($scope.isSubGroupShown(item)) {
        $scope.shownChild = null;
      } else {
        $scope.shownChild = item;
      }
      // $ionicScrollDelegate.resize();
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

    $scope.isSubGroupShown = function(item) {
      return $scope.shownChild === item;
    }

    /*  function moveHeader() {
        var bg = document.getElementById('contentBG');
        move(bg)
          .set('opacity', .1)
          .then()
          .set('opacity', 1)
          .duration('1s')
          .end();
      };*/
    /*Analytics Tracking START*/

    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Home View');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    //moveHeader();

    /*Analytics Tracking END*/

  })
  .controller('SearchCtrl', function($scope, $localstorage, $location, $window, $stateParams, productListService, searchService, headerIconsService) {
    //начальные состояния иконок корзины и wishlist
    $scope.$on('$stateChangeSuccess', function() {
      console.log("State changed: ");
      headerIconsService.getIconStatuses();
    });
    $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };
    $scope.searchArt = '';
    $scope.enableSearch = function() {
      console.log($scope.searchArt);
    }
    $scope.clearSearch = function() {
      $scope.searchArt = '';
    }
    $scope.startSearch = function() {

      $location.path("/tab/search/" + $scope.searchArt);
    }
    $scope.dev_width = $window.innerWidth / 2 + 'px';
    $scope.dev_height = $window.innerWidth / 2 + 50 + 'px';

    searchService.getInfo().success(function(response) {
      $scope.products = response.products;
      $scope.success = response.success;
    });
  })

.controller('CategoryCtrl', function($scope, $localstorage, $location, $window, $stateParams,
    $ionicModal, $ionicLoading, productListService, headerIconsService, WishlistCoutService) {
    //начальные состояния иконок корзины и wishlist
    $scope.$on('$stateChangeSuccess', function() {
      console.log("State changed: ");
      headerIconsService.getIconStatuses();
    });
    $ionicLoading.show({
        content: 'Загрузка',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/filterModal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.filtermodal = modal;
    });
    $ionicModal.fromTemplateUrl('templates/orderByModal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.orderBymodal = modal;
    });

    // Triggered in the filter modal to close it
    $scope.closeFilter = function() {
      $scope.filtermodal.hide();
    };
    // Triggered in the filter modal to close it
    $scope.closeOrderBy = function() {
      $scope.orderBymodal.hide();
    };


    // Open the filter modal
    $scope.filter = function() {
      $scope.filtermodal.show();
    };
    // Open the order by modal
    $scope.orderBy = function() {
      $scope.orderBymodal.show();
    };
    $scope.doOrderBy = function() {
      $scope.orderBymodal.hide();
    }
    $scope.dofilter = function() {
      $scope.filtermodal.hide();
    }
    $scope.asignFilter = {};
    //order functions
    $scope.autoorder = {
      sort: 'p.price',
      order: 'DESC'
    }
    $scope.order = 'final_price_inverse';

    $scope.OrderChanged = function(order) {
      console.log('changed');
      console.log(order);
      switch (order) {
        case 'final_price_inverse':
          $scope.autoorder = {
            sort: 'p.price',
            order: 'DESC'
          }
          break;
        case 'final_price_reverse':
          $scope.autoorder = {
            sort: 'p.price',
            order: 'ASC'
          }
          break;
        case 'date_reverse':
          $scope.autoorder = {
            sort: 'p.date_added',
            order: 'ASC'
          }
          break;
        case 'date_inverse':
          $scope.autoorder = {
            sort: 'p.date_added',
            order: 'DESC'
          }
          break;
        case 'percent_inverse':
          $scope.autoorder = {
            sort: 'percent',
            order: 'DESC'
          }
          break;
        case 'percent_reverse':
          $scope.autoorder = {
            sort: 'percent',
            order: 'ASC'
          }
          break;

        default:
          $scope.autoorder = {
            sort: 'p.price',
            order: 'DESC'
          }
      }
      productListService.getProducts($stateParams.categoryId, $scope.autoorder.sort, $scope.autoorder.order).then(function(data) {
        $ionicLoading.hide();
        $scope.products = data.products;
        $scope.filters = data.filters;
        console.log($scope.filters);
        console.log($scope.products);
      });
    }



    console.log($scope.wishlistStatusFull);
    $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };
    $scope.searchArt = '';
    $scope.enableSearch = function() {
      console.log($scope.searchArt);
    }
    $scope.clearSearch = function() {
      $scope.searchArt = '';
    }
    $scope.startSearch = function() {

        $location.path("/tab/search/" + $scope.searchArt);
      }
    //выделенные пользователем id фильтров
    $scope.filtersSelected = new Array();
    //массив информации с пользовательскими фильтрами
    $scope.userFilter = [];
    //новые фильтры на основе пользовательских фильтров
    var newFilters = [];
    //берем только айди новых фильтров на основе пользовательских фильтров
    var newFiltersID = [];
    $scope.clearfilter = function() {
      $scope.userFilter = [];
      $scope.filtermodal.hide();
      $scope.filtersSelected = [];
      newFilters = [];
      newFiltersID = [];
      $scope.showCleanFilterButton = false;
      productListService.getProducts($stateParams.categoryId, $scope.autoorder.sort, $scope.autoorder.order).then(function(data) {
        $ionicLoading.hide();
        $scope.products = data.products;
        $scope.filters = data.filters;
      /*  $scope.filters = [];
          for (var f = 0; f < data.filters.length; ++f) {
            $scope.filters.push({
              id: data.filters[f].id,
              name: data.filters[f].name,
              values: data.filters[f].values.sort(function (a, b) {  return a.localeCompare(b);  })
            })
          }*/
        console.log($scope.filters);
      });
    }

    $scope.setUserfilter = function(id, value) {
      //нужно для обнуления уже существующих фильтров
      //при добавлении нескольких пользовательских фильтров
      newFilters = [];
      newFiltersID = [];
      $scope.filtersSelected.push(id+'_'+value);
      $scope.showCleanFilterButton = true;
      $scope.userFilter.push({
        attribute_id: id,
        text: value
      })
    }

$scope.filterOreder = function(filter) {
  switch (filter.name) {
    case 'Размер':
       return 0;
       break
   case 'Цвет':
      return 1;
      break
   case 'Высота каблука':
      return 10;
      break
   default:
      return 1000;
      break
}
}

  //функция фильтрации каталога используется в  collection-repeat  filter:asignFilter
    $scope.asignFilter = function(product) {
      //переменная чтобы определить что продукт имеет все признаки пользовательского фильтра
      var haveAtributes =[];
      if ($scope.userFilter.length > 0) {
      //  console.log(newFiltersID);
      //  console.log('user filters not empty');
      //перебираем весь массив пользовательских фильтров
        for (var userFilterIndex = 0; userFilterIndex < $scope.userFilter.length; ++userFilterIndex) {
          //перебираем все атрибуты продукта
          for (var atributeIndex = 0; atributeIndex < product.attributes.length; ++atributeIndex) {
            if (product.attributes[atributeIndex].text == $scope.userFilter[userFilterIndex].text && product.attributes[atributeIndex].attribute_id == $scope.userFilter[userFilterIndex].attribute_id ) {
              //продукт подходит под  один из фильтров
              haveAtributes.push(product.attributes[atributeIndex].text);
            }

          }
        }
        //проверка на то что продукт подходит под все назначенные фильтры
        if($scope.userFilter.length == haveAtributes.length) {
          //продукт подходит под фильтр
          //функция добавления нового фильтра на основе опций продукта
          $scope.filters = newFilters;
          addNewFilter(product);
          return product;

        }

      } else {
        console.log('user filters empty');
        return product;
      }

    }
    //функция обновления доступных пользователю фильтров
    function addNewFilter(product) {
      //перебираем все атрибуты продукта
      for (var pa = 0; pa < product.attributes.length; ++pa) {
        //массив фильтров пуст просто добавляем без проверки новый фильтр
        if (newFilters.length == 0) {
          //добавляем id фильтра в массив то что он уже есть и нужно добавлять только values массив
          newFiltersID.push(product.attributes[pa].attribute_id);
          newFilters.push({
            id: product.attributes[pa].attribute_id,
            name: product.attributes[pa].name,
            values: new Array(product.attributes[pa].text)
          })
          //массив с новыми фильтрами не пустой
        } else {
          //проверяем есть ли айди фильтра в новом массиве (-1 нет)
          if (newFiltersID.indexOf(product.attributes[pa].attribute_id) == -1 && newFiltersID.length < 10) {
            //добавляем id фильтра в массив то что он уже есть и нужно добавлять только values массив
            newFiltersID.push(product.attributes[pa].attribute_id);
            newFilters.push({
              id: product.attributes[pa].attribute_id,
              name: product.attributes[pa].name,
              values: new Array(product.attributes[pa].text)
            });
          //массив содержит фильтр нужно обновить только values массив
          } else {
            //перебираем весь массив новых фильтров в поисках нужного
            for (var nf = 0; nf < newFilters.length; ++nf) {
              //поиск по значению ограничение не больше 20 (защита от рекруссии МОЖЕТ СОЖРАТЬ ВСЮ ПАМЯТЬ :) спасибо NASA )
              if (newFilters[nf].id == product.attributes[pa].attribute_id && newFilters.length < 20) {
                //проверка на уникальность значения values (дубли не нужны (-1) - уникальное значение)
                if (newFilters[nf].values.indexOf(product.attributes[pa].text) == -1) {
                  newFilters[nf].values.push(product.attributes[pa].text);
                }
              }
            }
          }

        }


      }

      $scope.filters = newFilters;
    }

    $scope.dev_width = $window.innerWidth / 2 + 'px';
    $scope.dev_height = $window.innerWidth / 2 + 50 + 'px';
    //  console.log($stateParams.categoryId);
    productListService.getProducts($stateParams.categoryId, $scope.autoorder.sort, $scope.autoorder.order).then(function(data) {
      $ionicLoading.hide();
      $scope.products = data.products;
      $scope.filters = data.filters;
      console.log(data.filters);
      console.log(data.products);
    });


    $scope.priceFormat = function(price) {

      return price.replace(".0000", "");
    }

  })
  .controller('ItemCtrl', function(
    $scope, $location, $ionicPlatform, $sanitize, $sce, $ionicActionSheet,
    $cordovaBadge, $stateParams, $localstorage, $ionicAnalytics, headerIconsService,
    $ionicSlideBoxDelegate, productAvaliableService, productImages, getProductById,
    WishlistCoutService, productInfoService, CartCoutService, $ionicAnalytics, SyncService
  ) {
    //начальные состояния иконок корзины и wishlist
    headerIconsService.getIconStatuses();
    $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };

    $scope.searchArt = function(search) {
      if (search) {
        $location.path("/tab/search/" + search);
        console.log(search);
      }
    };
    $scope.priceFormat = function(price) {

      return price.replace(".0000", "");
    };

    function decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    var productOPtions;
    var sizes = [];
    $scope.isAccess = true;
    productInfoService.getInfo().success(function(response) {
      $ionicAnalytics.track('View Item', {
        item_id: response.product.id,
        item_model: response.product.model
      });

      $scope.info = response;
      $scope.html = decodeHtml(response.product.description);
      $scope.model = response.product.model;
      var des = String(response.product.description);

      function htmlDecode(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }
      console.log(response);
      $scope.description = $sce.trustAsHtml(htmlDecode(des));
      //console.log(String(response.product.description));
      //$scope.description = $sanitize('response.product.description');
      if (response.product.options.length > 0) {
        //устанавливаем что не аксессуар
        $scope.isAccess = false;
        //if (response.product.options[0].hasOwnProperty('option_value')) {
        productOPtions = response.product.options[0].option_value;
        for (index = 0; index < response.product.options[0].option_value.length; index++) {
          //console.log(response.product.options[0].option_value[index].price);
          if(response.product.options[0].option_value[index].price_prefix == '-'){
          var price =  response.product.options[0].option_value[index].name.replace(".5", "½") + ' ('+response.product.options[0].option_value[index].price_prefix+response.product.options[0].option_value[index].price.replace(".0000", "")+')';
          }else {
          var price = response.product.options[0].option_value[index].name.replace(".5", "½");
          }
          sizes.push({

            //вставляем размер в массив и заменям половиники на красивое написание
            text: price
          });
          //console.log(response.product.options[index]);
        }
      }

      if (response.product.special > 0) {
        $scope.total = response.product.special;
      } else {
        $scope.total = response.product.price;
      }
      $ionicSlideBoxDelegate.$getByHandle('img-viewer').update();

    });



    productAvaliableService.getProducts($scope.model).then(function(data) {
      $scope.products = data;
      //console.log($scope.products);
    });
    $scope.buyIt = function() {
      buy();
    }
    $scope.show = function() {

      var hideSheet = $ionicActionSheet.show({
        buttons: sizes,

        titleText: 'Выберите Ваш размер',
        cancelText: 'Отмена',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {
          buy(productOPtions[index].name, productOPtions[index].option_value_id, productOPtions[index].price_prefix,  productOPtions[index].price);
          return true;
        }
      });
    };

    function buy(size, option_value_id, price_prefix, price) {
      size = typeof size !== 'undefined' ? size : null;
      option_value_id = typeof option_value_id !== 'undefined' ? option_value_id : null;
      $ionicAnalytics.track('Buy Item', {
        item_id: $scope.info.product.id,
        item_model: $scope.model
      });
      console.log('buy click!');
      var BuyPrice = $scope.total;
      if(price_prefix == '-' ) {
         BuyPrice = $scope.total - price;
      }
      //корзина пуста создаем новый объект и помещаем туда айди товара
      if ($localstorage.getObject('shoppingCart') === null) {
        $localstorage.setObject('shoppingCart', {
          //total: parseInt($scope.total),
          //  quantity: 1,
          items: [{
            id: $scope.info.product.id,
            model: $scope.model,
            size: size,
            option_value_id: option_value_id,
            price: BuyPrice
          }]
        });
        var shoppingCart = $localstorage.getObject('shoppingCart');
        $scope.shoppingCartStatusFull = 1;
        CartCoutService.setCartCount($localstorage.getObject('shoppingCart').items.length);
        $scope.CartCount = $localstorage.getObject('shoppingCart').items.length;
        console.log('shoppingCart is empty');
      } else {
        var shoppingCart = $localstorage.getObject('shoppingCart');

        var total = parseInt(shoppingCart.total);
        //analytics
        $ionicAnalytics.track('Add to cart', {
          item_id: $scope.info.product.id,
          item_name: $scope.model
        });
        //analytics
        //  shoppingCart.total = 0;
        //  shoppingCart.total = total + parseInt($scope.total);
        shoppingCart.items.push({
          id: $scope.info.product.id,
          model: $scope.model,
          size: size,
          option_value_id: option_value_id,
          price: $scope.total
        });
        $localstorage.setObject('shoppingCart', shoppingCart);
        CartCoutService.setCartCount($localstorage.getObject('shoppingCart').items.length);
        $scope.CartCount = $localstorage.getObject('shoppingCart').items.length;
        $scope.shoppingCartStatusFull = 1;
        console.log('shoppingCart NOT empty');

      }
    };

    bageModify = function(bageNum) {
      var _bageNum = bageNum;

      $cordovaBadge.hasPermission().then(function(yes) {
        // You have permission
        $cordovaBadge.set(_bageNum).then(function() {
          // You have permission, badge set.
        }, function(err) {
          // You do not have permission.
          console.log(no);
        });
      }, function(no) {
        // You do not have permission
        console.log(no);
      });
    };

    $scope.wishlist = function() {
      console.log('wishlist click!');
      //для смены иконки
      $scope.inWishlist = true;
      console.log($scope.inWishlist);
      if ($localstorage.getObject('wishlist') === null) {
        var wishitems = [];
        wishitems[0] = $scope.info.product.id
          //analytics
        $ionicAnalytics.track('Add to wishlist', {
          item_id: $scope.info.product.id,
          item_name: $scope.model
        });
        //analytics
        $localstorage.setObject('wishlist', wishitems);
        var wishlist = $localstorage.getObject('wishlist');
        $scope.wishlistStatusFull = 1;
        WishlistCoutService.setWishlistCount(wishitems.length);
        $scope.wishlistCount = wishitems.length;
        bageModify(wishitems.length);
        console.log('wishlist is empty');
      } else {
        var wishitems = $localstorage.getObject('wishlist');
        $scope.wishlistStatusFull = 1;
        //analytics
        $ionicAnalytics.track('Add to wishlist', {
          item_id: $scope.info.product.id,
          item_name: $scope.model
        });
        //analytics
        if (wishitems.indexOf($scope.info.product.id) === -1) {
          wishitems.push($scope.info.product.id);
        }
        $localstorage.setObject('wishlist', wishitems);
        WishlistCoutService.setWishlistCount(wishitems.length);
        $scope.wishlistCount = WishlistCoutService.getWishlistCount;
        console.log($scope.wishlistCount);
        bageModify(wishitems.length);
        console.log('wishlist is NOT empty');
        console.log(wishitems);
      }
      //синхронизация wishlist
      if ($localstorage.getObject('account') != null) {
        SyncService.wishlist($localstorage.getObject('account').customer_id);
      }

    };


  })


.controller('ItemQuantityCtrl', function($scope, $location, $stateParams, $ionicLoading, $cordovaGoogleAnalytics, productAvaliableService, headerIconsService) {
  $scope.searchArt = function(search) {
    if (search) {
      $location.path("/tab/search/" + search);
      console.log(search);
    }
  };
  $scope.onTabSelected = function() {
    $state.go('tab.menu');
  };
  $scope.priceFormat = function(price) {

    return price.replace(".0000", "");
  };
  /*Analytics Tracking START*/
  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('ItemQuantity View');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();
  /*Analytics Tracking END*/
  //начальные состояния иконок корзины и wishlist
  headerIconsService.getIconStatuses();
  $ionicLoading.show({
    content: 'Загрузка',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  productAvaliableService.getProductsDefect($stateParams.itemId).then(function(data) {
    $ionicLoading.hide();
    $scope.products = data;


    //console.log($scope.products);
  });


})

.controller('RegistrationCtrl', function($cordovaGoogleAnalytics, $localstorage, $scope, $location, $state, $window, getRegionsService, headerIconsService, registerAccountService) {
  //начальные состояния иконок корзины и wishlist
  headerIconsService.getIconStatuses();
  /*Analytics Tracking START*/
  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('Registration View');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();
  /*Analytics Tracking END*/
  var country_id = 176;
  $scope.data = {};
  $scope.data.country_id = country_id;
  //Moscow
  $scope.data.zone_id = 2761;
  getRegionsService.getZones(country_id).success(function(response) {
    $scope.zones = response.zones;
  });

  // function to submit the form after all validation has occurred
  $scope.submitForm = function(isValid) {
    console.log('validation start');
    $scope.submitted = true;
    // check to make sure the form is completely valid
    if (isValid) {
      console.log('form Valid!');
      //console.log();
      //$scope.data.country_id= 176;
      registerAccountService.register($scope.data).then(function(data) {
        $scope.result = data;
        if (data.data.success == true) {

          $localstorage.setObject('account', {
            customer_id: data.data.accountInfo.account.customer_id,
            firstname: data.data.accountInfo.account.firstname,
            lastname: data.data.accountInfo.account.lastname,
            password: $scope.data.password,
            email: data.data.accountInfo.account.email,
            telephone: data.data.accountInfo.account.telephone,
            address_id: data.data.accountInfo.account.address_id
          });

          if ($localstorage.getObject('account') != null) {
            $location.path("/tab/customer");
          }

        }
        if (data.data.success == false) {
          $scope.error = data.data.error;
        }
        console.log(data);
      });

    } else {

      console.log('form InValid!');

    }

  };
})


.controller('WishlistCtrl', function($scope, $ionicPlatform, $cordovaBadge, $window,
    $location, $ionicAnalytics, $ionicActionSheet, $timeout, $stateParams, $cordovaGoogleAnalytics,
    WishlistCoutService, $ionicHistory, $localstorage, wishlistService) {
    console.log('Start WishlistCtrl');

    $scope.dev_width = $window.innerWidth / 2 + 'px';
    $scope.dev_height = $window.innerWidth / 2 + 50 + 'px';
    /*Analytics Tracking START*/
    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Wishlist');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    /*Analytics Tracking END*/
    bageModify = function(bageNum) {
      var _bageNum = bageNum;

      $cordovaBadge.hasPermission().then(function(yes) {
        // You have permission
        $cordovaBadge.set(_bageNum).then(function() {
          // You have permission, badge set.
        }, function(err) {
          // You do not have permission.
          console.log(no);
        });
      }, function(no) {
        // You do not have permission
        console.log(no);
      });
    };

    // Triggered on a button click, or some other target
    $scope.show = function(id) {
      var _id = id;
      console.log(_id);
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Добавить в корзину'
        }],
        destructiveText: 'Удалить',
        titleText: 'Список желаний',
        cancelText: 'Отмена',
        cancel: function() {
          return true;
        },
        destructiveButtonClicked: function() {
          var wishitems = $localstorage.getObject('wishlist');
          var i = wishitems.indexOf(_id);
          if (i != -1) {
            wishitems.splice(i, 1);
            console.log('delete it!');
            //analytics
            $ionicAnalytics.track('Remove from wishlist', {
              item_id: _id
            });
            //analytics

            if (wishitems.length == 0) {
              $localstorage.deleteKey('wishlist');
              CartCoutService.setWishlistCount(0);
              $scope.wishlistCount = 0;
            } else {
              $localstorage.setObject('wishlist', wishitems);
              WishlistCoutService.setWishlistCount(wishitems.length);
              $scope.wishlistCount = WishlistCoutService.getWishlistCount;
              bageModify(wishitems.length);
              getWishlist();
            }


          } else {
            console.log(_id);
          }
          return true;
        },
        buttonClicked: function(index) {
          if (index == 0) {
            $location.path("/tab/collection/item/" + _id);
          }
          return true;
        }
      });


    };
    getWishlist = function() {
      if ($localstorage.getObject('wishlist') != null) {
        var wishitems = $localstorage.getObject('wishlist');
        $scope.wishilist = wishitems;
        wishlistService.getWishlist($scope.wishilist).then(function(data) {
          $scope.products = data.data.products;
        });
      }

    }
    getWishlist();


  })
  .controller('CartCtrl', function($scope, $stateParams, $cordovaGoogleAnalytics,
    $window, $cordovaBadge, $location, $localstorage, $ionicActionSheet, $ionicPopup, $ionicLoading, $ionicModal, ionicDatePicker,
    deliveryCostService, adressesService, cartInfoService, OrderService, OrderIDService, CartCoutService, WishlistCoutService, $ionicAnalytics,
    couponService) {
    console.log('Start CartCtrl');
    /*Analytics Tracking START*/
    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Cart');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    /*Analytics Tracking END*/





    $scope.deliveryCost = 0;
    $scope.deliveryCode = null;
    $scope.finalTotal = 0;
    $scope.deliverytime = '';
    $scope.comment = '';
    $scope.ChosenAdress = '';
    $scope.deliveryDateFormated = '';
    $scope.enableBuyButton = function() {
      if ($scope.deliveryCode != null && $scope.ChosenAdress != '') {
        return true;
      } else {
        return false;
      }
    }

    $scope.adress_choise = null;
    if ($localstorage.getObject('account') != null) {
      var customer_id = $localstorage.getObject('account').customer_id;
      if ($localstorage.getObject('account').address_id != null) {
        $scope.adress_choise = $localstorage.getObject('account').address_id;
      };
      adressesService.getadresses(customer_id).success(function(response) {

        if (response.success == true) {
          //если вдруг что то пошло не так и адрес не выбран
          //берем любой адрес из всех адресов пользователя
          if ($scope.adress_choise == null) {
            var key;
            for (key in response.adresses) {
              if (response.adresses.hasOwnProperty(key) && /^0$|^[1-9]\d*$/.test(key) && key <= 4294967294) {
                $scope.adress_choise = response.adresses[key].address_id;
              }
            }
            // устанавливаем стоимость доставки
            setDelivery();
          }

          $scope.adresses = response.adresses;
          listOfAdress = response.adresses;


        } else {
          console.log('false');
          $scope.adress_error = true;
        }
      });
    }


    var DatePickerOptions = {
      callback: function(val) {
        var d = new Date(val);
        var t = d.getDate() + "." + ((String(d.getMonth()).length == 1) ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + "." + d.getFullYear();
        $scope.deliveryDateFormated = d.getFullYear() + "-" + d.getDate() + "-" + ((String(d.getMonth()).length == 1) ? "0" + d.getMonth() : d.getMonth());
        $scope.deliveryDate = t;

      }
    };

    $scope.openDatePicker = function() {
      ionicDatePicker.openDatePicker(DatePickerOptions);
    };

    setDelivery = function() {
      if ($scope.adress_choise != null) {
        adressesService.getadress($scope.adress_choise).success(function(response) {
          console.log('SET adress');
          console.log(response.adress);
          $scope.country_id = response.adress.country_id;
          $scope.zone_id = response.adress.zone_id;
          $scope.ChosenAdress = response.adress;

          var startDate = new Date();
          startDate.setDate(startDate.getDate() + 2);
          if (startDate.getDay() == 6) {
            startDate.setDate(startDate.getDate() + 2);
          }
          if (startDate.getDay() == 0) {
            startDate.setDate(startDate.getDate() + 1);
          }
          var startDateFormated = startDate.getDate() + "." + ((String(startDate.getMonth()).length == 1) ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "." + startDate.getFullYear();
          console.log(response.adress.zone_id);
          if (response.adress.zone_id == '2761') {
            $scope.deliveryDate = startDateFormated;
            //$scope.deliveryDateFormated =startDate;
            $scope.deliveryDateFormated = startDate.getFullYear() + "-" + startDate.getDate() + "-" + ((String(startDate.getMonth()).length == 1) ? "0" + startDate.getMonth() : d.getMonth());
            $scope.deliverytime = 'Любое время';
          } else {
            console.log('no Moscow');
            $scope.deliveryDate = '';
            $scope.deliverytime = '';
          }
          deliveryCostService.getcost($scope.zone_id, $scope.country_id).success(function(response) {
            console.log('deliveryCOst');

            $scope.deliveryCost = response.cost;
            $scope.deliveryCode = response.code;
            $scope.shipping_method = response.title;
            $scope.finalTotal = $scope.total + $scope.deliveryCost;
            console.log(response.cost);
          });
        });


      } else {
        console.log('CANT SET adress!!!!');
      }
    }

    $scope.setNewDelivery = function(address_id) {
      adressesService.getadress(address_id).success(function(response) {
        console.log('SET NEW adress');
        console.log(response.adress);
        $scope.country_id = response.adress.country_id;
        $scope.zone_id = response.adress.zone_id;
        $scope.ChosenAdress = response.adress;
        var startDate = new Date();
        startDate.setDate(startDate.getDate() + 2);
        if (startDate.getDay() == 6) {
          startDate.setDate(startDate.getDate() + 2);
        }
        if (startDate.getDay() == 0) {
          startDate.setDate(startDate.getDate() + 1);
        }
        var startDateFormated = startDate.getDate() + "." + ((String(startDate.getMonth()).length == 1) ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "." + startDate.getFullYear();
        console.log(response.adress.zone_id);
        if (response.adress.zone_id == '2761') {
          $scope.deliveryDate = startDateFormated;
          $scope.deliveryDateFormated = startDate.getFullYear() + "-" + startDate.getDate() + "-" + ((String(startDate.getMonth()).length == 1) ? "0" + startDate.getMonth() : d.getMonth());
          //$scope.deliveryDateFormated =startDate;
          $scope.deliverytime = 'Любое время';
        } else {
          console.log('no Moscow');
          $scope.deliveryDate = '';
          $scope.deliverytime = '';
        }

        deliveryCostService.getcost($scope.zone_id, $scope.country_id).success(function(response) {
          console.log('deliveryCOst');

          $scope.deliveryCost = response.cost;
          $scope.deliveryCode = response.code;
          $scope.shipping_method = response.title;
          $scope.finalTotal = $scope.total + $scope.deliveryCost;
          console.log(response.cost);
        });
      });



    }

    setDelivery();
    showAlert = function() {
      $ionicPopup.alert({
        title: 'Ой',
        content: 'Часть из отложенных Вами артикулов закончилась.<br> Мы удалили их из вашей корзины.',
        okType: 'button-dark'
      });
    };

    populateCart = function() {
      $scope.total = 0;
      if ($localstorage.getObject('shoppingCart') != null) {
        var cItems = [];
        var cartitems = $localstorage.getObject('shoppingCart');

        for (var ic = 0, len = cartitems.items.length; ic < len; ic++) {

          var product_id = cartitems.items[ic].id;
          //{"items":[{"id":"17936","model":"17-675-02-37-235","size":"38","option_value_id":"52","price":"15800.0000"}]}

          cartInfoService.getProduct(cartitems.items[ic].id, cartitems.items[ic].option_value_id).success(function(response) {

            console.log(response);

            //товар закончился проверка
            if (response.product.id != null) {
              cItems.push(response.product);
              $scope.total = $scope.total + response.product.price;
            } else {
              console.log('NO art ' + product_id);
              removeFromCart(product_id);
              showAlert();
            }
          });
        }
        $scope.itemc = cItems;
        $scope.HaveCoupon =false;
        $scope.free_shipping =false;
        $scope.TotalDiscount =0;
        console.log(cItems);
      } else {
        $scope.itemc = [];
      }

    };
    removeFromCart = function(id) {
      if ($localstorage.getObject('shoppingCart') != null) {
        var cartDelItems = $localstorage.getObject('shoppingCart');
        for (var i = 0; i < cartDelItems.items.length; i++) {

          if (cartDelItems.items[i].id == id) {
            //analytics
            $ionicAnalytics.track('Delete from Cart', {
              item_id: cartDelItems.items[i].id,
              item_name: cartDelItems.items[i].model
            });
            //analytics
            $scope.total = parseInt($scope.total) - parseInt(cartDelItems.items[i].price);
            console.log(parseInt(cartDelItems.items[i].price));
            console.log('found and remove item id ' + cartDelItems.items[i].model);
            cartDelItems.items.splice(i, 1);
            if (cartDelItems.items.length == 0) {
              $localstorage.deleteKey('shoppingCart');
              CartCoutService.setCartCount(0);
              $scope.CartCount = 0;
            } else {
              $localstorage.setObject('shoppingCart', cartDelItems);
              CartCoutService.setCartCount($localstorage.getObject('shoppingCart').items.length);
              $scope.CartCount = $localstorage.getObject('shoppingCart').items.length;
            }
            populateCart();
          };
        };

      };
    };

    wishlist = function(id) {
      //для смены иконки
      $scope.inWishlist = true;
      console.log($scope.inWishlist);
      if ($localstorage.getObject('wishlist') === null) {
        var wishitems = [];
        wishitems[0] = id
        $localstorage.setObject('wishlist', wishitems);
        var wishlist = $localstorage.getObject('wishlist');
        $scope.wishlistStatusFull = 1;
        WishlistCoutService.setWishlistCount(wishitems.length);
        $scope.wishlistCount = WishlistCoutService.getWishlistCount;
        bageModify(wishitems.length);
      } else {
        var wishitems = $localstorage.getObject('wishlist');
        $scope.wishlistStatusFull = 1;
        if (wishitems.indexOf(id) === -1) {
          wishitems.push(id);
        }
        $localstorage.setObject('wishlist', wishitems);
        WishlistCoutService.setWishlistCount(wishitems.length);
        $scope.wishlistCount = WishlistCoutService.getWishlistCount;
        bageModify(wishitems.length);

      }
    };
    bageModify = function(bageNum) {
      var _bageNum = bageNum;

      $cordovaBadge.hasPermission().then(function(yes) {
        // You have permission
        $cordovaBadge.set(_bageNum).then(function() {
          // You have permission, badge set.
        }, function(err) {
          // You do not have permission.
          console.log(no);
        });
      }, function(no) {
        // You do not have permission
        console.log(no);
      });
    };



    if ($localstorage.getObject('account') === null) {
      $scope.isLogin = false;
    } else {
      $scope.isLogin = true;
    }

    $scope.show = function(id) {

      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'Посмотреть'
        }, {
          text: 'Отложить'
        }],
        destructiveText: 'Удалить из корзины',
        titleText: 'Редактировать корзину',
        cancelText: 'Отмена',
        cancel: function() {
          // add cancel code..
          return true;
        },
        destructiveButtonClicked: function() {
          console.log('item id is ' + id);
          removeFromCart(id);
          return true;
        },
        buttonClicked: function(index) {
          switch (index) {
            case 0:
              $location.path("/tab/collection/item/" + id);
              return true;
              break
            case 1:
              wishlist(id);
              removeFromCart(id);
              return true;
            default:
              return true;
          }

        }
      });
    };




    populateCart();

    $scope.addOrder = function() {
      $ionicLoading.show({
        template: 'Отправляем данные заказа...',
        hideOnStateChange: true,
        noBackdrop: true
      });
      var totals = [{
        code: 'sub_total',
        title: 'Сумма',
        text: $scope.total + ' р.',
        value: $scope.total,
        sort_order: 1
      }, {
        code: 'shipping',
        title: $scope.shipping_method,
        text: $scope.deliveryCost + ' р.',
        value: $scope.deliveryCost,
        sort_order: 3
      }, {
        code: 'total',
        title: 'Итого',
        text: $scope.finalTotal + ' р.',
        value: $scope.finalTotal,
        sort_order: 9
      }];
      if (  $scope.HaveCoupon ==true) {
        totals.push({
          code: 'coupon',
          title: 'Купон (' + $scope.couponName +'):',
          text: $scope.TotalDiscount + ' р.',
          value: $scope.TotalDiscount,
          sort_order: 0
        });
      }
      var products = [];
      console.log($scope.itemc);
      for (i = 0, len = $scope.itemc.length; i < len; i++) {
        //analytics
        $ionicAnalytics.track('Purchase Item', {
          item_id: $scope.itemc[i].id,
          item_name: $scope.itemc[i].model
        });
        //analytics
        var p = {
          product_id: $scope.itemc[i].id,
          name: $scope.itemc[i].name,
          model: $scope.itemc[i].model,
          quantity: 1,
          price: $scope.itemc[i].price,
          total: $scope.itemc[i].price,
          tax: 0,
          reward: 0
        }
        if ($scope.itemc[i].option_name.length > 0) {
          p['option'] = [{
            product_option_value_id: $scope.itemc[i].product_option_value_id,
            product_option_id: $scope.itemc[i].product_option_id,
            name: 'Размер',
            value: $scope.itemc[i].option_name,
            type: 'select'
          }]
        }
        products.push(p);
      }

      var OrderData = {
        invoice_prefix: 'M-2016',
        store_id: 1,
        store_name: 'CORSOCOMO Mobile App',
        store_url: 'https://corsocomo.com/',
        customer_id: $localstorage.getObject('account').customer_id,
        customer_group_id: 8,
        firstname: $localstorage.getObject('account').firstname,
        lastname: $localstorage.getObject('account').lastname,
        email: $localstorage.getObject('account').email,
        telephone: $localstorage.getObject('account').telephone,
        payment_firstname: $scope.ChosenAdress.firstname,
        payment_lastname: $scope.ChosenAdress.lastname,
        payment_company: $scope.ChosenAdress.company,
        payment_address_1: $scope.ChosenAdress.address_1,
        payment_address_2: $scope.ChosenAdress.address_2,
        payment_city: $scope.ChosenAdress.city,
        payment_postcode: $scope.ChosenAdress.postcode,
        payment_country: $scope.ChosenAdress.country,
        payment_country_id: $scope.ChosenAdress.country_id,
        payment_zone: $scope.ChosenAdress.zone,
        payment_zone_id: $scope.ChosenAdress.zone_id,
        payment_method: 'Оплата при доставке',
        payment_code: 'cod',
        shipping_firstname: $scope.ChosenAdress.firstname,
        shipping_lastname: $scope.ChosenAdress.lastname,
        shipping_company: $scope.ChosenAdress.company,
        shipping_address_1: $scope.ChosenAdress.address_1,
        shipping_address_2: $scope.ChosenAdress.address_2,
        shipping_city: $scope.ChosenAdress.city,
        shipping_postcode: $scope.ChosenAdress.postcode,
        shipping_country: $scope.ChosenAdress.country,
        shipping_country_id: $scope.country_id,
        shipping_zone: $scope.ChosenAdress.zone,
        shipping_zone_id: $scope.ChosenAdress.zone_id,
        shipping_method: $scope.shipping_method,
        shipping_code: $scope.deliveryCode,
        delivery_date: $scope.deliveryDateFormated,
        delivery_time: $scope.deliverytime,
        comment: $scope.comment + ' ' + $scope.deliveryDateFormated + ' ' + $scope.deliverytime,
        total: $scope.finalTotal,
        //order_status_id:1,
        affiliate_id: 0,
        commission: 0,
        language_id: 1,
        currency_id: 1,
        currency_code: 'RUB',
        currency_value: 1,
        products: products,
        totals: totals
      };
      $scope.login = function() {
        $location.path("/tab/account");
      }
      console.log(OrderData);
      OrderService.addOrder(OrderData).then(function(data) {
        console.log('SEND DATA');
        var res = data.data;
        OrderIDService.setOrderId(res.order_id);
        if (res.success == true) {
          $location.path("/tab/success");
        }
        if(res.success == false) {
          $ionicLoading.show({
            template: res.error,
            duration: 3000,
            noBackdrop: true
          });
        }

        console.log(data);
      });
    };
    $ionicModal.fromTemplateUrl('templates/couponModal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.couponModal = modal;
    });

    // Triggered in the filter modal to close it
    $scope.closeCoupon = function() {
      $scope.couponModal.hide();
    };
    // Open the filter modal
    $scope.couponOpen = function() {
      $scope.couponModal.show();
    };
    $scope.couponCode = {
       code: ''
     };
    //$scope.couponCode ='';
    //начальное значение что у пользователя нет купона
    $scope.HaveCoupon =false;
    $scope.free_shipping =false;
    $scope.applyCoupon = function() {

      var couponApplyProducts = [];
      console.log($scope.couponCode.code);
      console.log($scope.itemc);
      for (i = 0, len = $scope.itemc.length; i < len; i++) {
        var p = {
          product_id: $scope.itemc[i].id,
          total: $scope.itemc[i].price,

        }
        couponApplyProducts.push(p);
      }
      var couponData = {
        products: couponApplyProducts,
        customer_id : $localstorage.getObject('account').customer_id,
        coupon: $scope.couponCode.code
      };
      $scope.couponModal.hide();

      couponService.applyCoupon(couponData).success(function(response) {
        if(response.success == true){
          $scope.couponName = response.coupon;
          $scope.HaveCoupon =true;
          $scope.TotalDiscount= response.discount_total;
          //купон с бесплатной доставкой прибавляем скидку по доставке
          if(response.free_shipping == true) {
              $scope.free_shipping =true;
            $scope.TotalDiscount=response.discount_total + $scope.deliveryCost;
            $scope.finalTotal -= $scope.deliveryCost;
          }
          $scope.finalTotal -=$scope.TotalDiscount;

        }
        console.log(response);
      });
    };
  })
  .controller('SuccessOrderCtrl', function($scope, $stateParams, OrderIDService, $localstorage) {
    $localstorage.deleteKey('shoppingCart');
    $scope.order_id = OrderIDService.getOrderId();
  })
  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })




.controller('AccountCtrl', function($scope, $location, $http, $ionicHistory, $localstorage, $cordovaGoogleAnalytics, forgotPassService) {

  console.log('Start AccountCtrl');
  /*Analytics Tracking START*/
  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('Account');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();
  /*Analytics Tracking END*/
  //начальные состояния иконок корзины и wishlist
  if ($localstorage.getObject('wishlist') === null) {
    $scope.wishlistStatusFull = 0;
    $scope.wishilistItems = 0;
  } else {
    $scope.wishlistStatusFull = 1;
    $scope.wishilistItems = $localstorage.getObject('wishlist').length;
  }
  if ($localstorage.getObject('shoppingCart') === null) {
    $scope.shoppingCartStatusFull = 0;
  } else {
    $scope.shoppingCartStatusFull = 1;
  }

  $scope.data = {};
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  var account = $localstorage.getObject('account');
  if (account != null) {
    $location.path("/tab/customer");

  }
  $scope.askPassword = function(email) {
    forgotPassService.getPass(email).success(function(response) {
      $scope.passResult = response;
      console.log(response);
    });


  }
  $scope.submit = function() {
    var link = 'https://corsocomo.com/?route=feed/web_api/login&key=12Server34';
    /*  var authProvider = 'basic';
 var authSettings = { 'remember': true };

 var loginDetails = {
   'email': $scope.data.email,
   'password': $scope.data.password
 };
var authSuccess = function() {
    // replace dash with the name of your main state
    console.log('authOK')
  };

var authFailure = function(errors) {
    for (var err in errors) {
      console.log(err);
      // check the error and provide an appropriate message
      // for your application
    }
  };
  //$scope.login = function(provider) {
     Ionic.Auth.login(authProvider, authSettings, loginDetails)
       .then(authSuccess, authFailure);
  // };
*/

    $http.post(link, {
      email: $scope.data.email,
      password: $scope.data.password
    }).then(function(res) {
      $scope.response = res.data;
      console.log(res.data);
      if (res.data.success == true) {
        $localstorage.setObject('account', {
          customer_id: res.data.account.customer_id,
          firstname: res.data.account.firstname,
          lastname: res.data.account.lastname,
          password: $scope.data.password,
          email: res.data.account.email,
          telephone: res.data.account.telephone,
          address_id: res.data.account.address_id
        });
        if (res.data.account.wishlist != null) {
          $localstorage.setObject('wishlist', res.data.account.wishlist);
        }
      }
      if ($localstorage.getObject('account') != null) {
        $location.path("/tab/customer");
      }
    });
  };
  console.log($localstorage.getObject('account'));
});
