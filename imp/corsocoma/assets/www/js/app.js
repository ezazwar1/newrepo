// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
/*
Вы несете ответственность за соответствие приложения экспортным требованиям. Потребуется заново ответить на эти вопросы, если статус шифрования или правоприменимость исключения из правил экспортного контроля для Вашего приложения изменится. Если шифрование или правоприменимость исключения остаются неизменными, используйте следующую пару «ключ-значение» в файле Info.plist, чтобы предоставить информацию о соответствии сборки экспортным требованиям:
<key>ITSAppUsesNonExemptEncryption</key><false/>
*/
angular.module('starter', ['ngCordova', 'ionic', 'ionic.service.core', 'ionic.service.analytics', 'ngSanitize',
                            'ionic-datepicker', 'angularMoment', 'barcode','starter.controllers', 'starter.services',
                            'corso.factories', 'shop.factory', 'scan.controller', 'shop.controller', 'discountCard.factory',
                            'ordersHistory.controller', 'customer.controller', 'customer.factories', 'corso.directives',
                            'ionicLazyLoad', 'user.controller' ])


.run(function($ionicPlatform, $cordovaPush, $cordovaDialogs, $ionicAnalytics, $localstorage, $ionicPopup, $cordovaDevice, WishlistCoutService, CartCoutService, TokenService) {
  $ionicPlatform.ready(function() {
    /*
    очистка корзины если что то пошло не так из предыдущих версий
    */
    if ($localstorage.getObject('shoppingCart') != null) {
      var cart = $localstorage.getObject('shoppingCart');
      if (cart.items.length == 0) {
        CartCoutService.setCartCount(0);
        $localstorage.deleteKey('shoppingCart');
      } else {
        CartCoutService.setCartCount(cart.items.length);
      }
    }
    if ($localstorage.getObject('wishlist') != null) {
      var wishlist = $localstorage.getObject('wishlist');
      if (wishlist.length == 0) {
        WishlistCoutService.setWishlistCount(0);
        $localstorage.deleteKey('wishlist');
      } else {
        WishlistCoutService.setWishlistCount(wishlist.length);
      }
    }


    $ionicAnalytics.register();

    // enable push notifications
    Ionic.io();

    // enable users (http://docs.ionic.io/docs/user-quick-start)
    // this will give you a fresh user or the previously saved 'current user'
    /*  var user = Ionic.User.current();

      // if the user doesn't have an id, you'll need to give it one.
      if (!user.id) {
        if ($localstorage.getObject('account') != null) {
          var ccUser = $localstorage.getObject('account');
          user.id = ccUser.customer_id;
          user.set('firstname', ccUser.firstname);
          user.set('lastname', ccUser.lastname);
        } else {
          user.id = Ionic.User.anonymousId();
        }
        // user.id = 'your-custom-user-id';
      }
      console.log('user-id:' + user.id);

      //persist the user
      user.save();*/

    //Wishlist and Cart Set
    if ($localstorage.getObject('wishlist') != null) {
      WishlistCoutService.setWishlistCount($localstorage.getObject('wishlist').length);
    } else {
      WishlistCoutService.setWishlistCount(0);
    }



    //Working push implementation
    //18853e112359c78fd10b4b1b1355907813d31ad4db6215aef447b7fb4ab30463
    // curl -u f31f68cd6b0b92de9904f56a1d82f58d62ac2af8a7a82d63: -H "Content-Type: application/json" -H "X-Ionic-Application-Id: 9640a366" https://push.ionic.io/api/v1/push -d '{"tokens":["18853e112359c78fd10b4b1b1355907813d31ad4db6215aef447b7fb4ab30463"],"notification":{"alert":"I come from planet Ion."}}'

    var push = PushNotification.init({
      'android': {
        "senderID": "480713728381",
        "icon": "ic_stat_cc_500",
        "iconColor": "grey" //Project ID from Google developer console
      },
      'ios': {
        "alert": "true",
        "badge": "true",
        "sound": "true",
      /*  "categories": {
            "successshop": {
                "yes": {
                    "callback": "app.okshop", "title": "Да", "foreground": true, "destructive": false
                },
                "no": {
                    "callback": "app.badshop", "title": "Нет", "foreground": true, "destructive": false
                },
                "maybe": {
                    "callback": "app.neutral", "title": "Не совсем", "foreground": true, "destructive": false
                }
            },
            "category": {
                "yes": {
                    "callback": "app.viewCategory", "title": "Посмотреть", "foreground": true, "destructive": true
                },
                "no": {
                    "callback": "app.cancelCategory", "title": "Не интерестно", "foreground": true, "destructive": false
                }
            },
            "coupon": {
                "yes": {
                    "callback": "app.applyCoupon", "title": "Начать покупки", "foreground": true, "destructive": true
                },
                "no": {
                    "callback": "app.cancelCoupon", "title": "Не интерестно", "foreground": true, "destructive": false
                }
            }
        }*/
      },
    });
  /*  app.okshop = function(data) {
    // do something with the notification data
    console.log('okshop function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      }, data.additionalData.notId);
    };

    app.badshop = function(data) {
    // do something with the notification data
    console.log('badshop function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      }, data.additionalData.notId);
    };
    app.neutral = function(data) {
    // do something with the notification data
    console.log('neutral function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      }, data.additionalData.notId);
    };

    app.viewCategory = function(data) {
    // do something with the notification data
    console.log('viewCategory function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      });
    };
    app.cancelCategory = function(data) {
    // do something with the notification data
    console.log('cancelCategory function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      });
    };

    app.applyCoupon = function(data) {
    // do something with the notification data
    console.log('applyCoupon function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      });
    };

    app.cancelCoupon = function(data) {
    // do something with the notification data
    console.log('cancelCoupon function');
    console.log(data);
      push.finish(function() {
          console.log('accept callback finished');
      }, function() {
          console.log('accept callback failed');
      });
    };
*/

    push.on('registration', function(data) {
      $localstorage.setObject('token', data.registrationId);
      //We need to save registration id somewhere on server to be able to send push notifications to this device
      TokenService.sendUserToken(null, data.registrationId);
      //saveRegistrationIdSomewhereOnServer(data.registrationId);
    });


    push.on('notification', function(data) {
      // alert('You Got New Notification');
      $cordovaDialogs.alert(data.message, data.title, 'OK');
    if ($localstorage.getObject('token') != null) {
      TokenService.sendPushReceiveConf($localstorage.getObject('token') , data.message);
    }
    });


      /*var showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: data.title,
          template: data.message
        });

        alertPopup.then(function(res) {
          console.log('Push прочитан');
        });
      };
      showAlert();
      */



      //  alert(data.message, data.title,
      // data.count,
      // data.sound,
      // data.image,);
      //Setup notification received event handler. data object contains notification params
  ///  });

    push.on('error', function(e) {
      console.log(e);
      // An error has occured during push notifications initialization, e.message contains error message text
    });



    /*
        var push = new Ionic.Push({
         "debug": false,
          "onNotification": function(notification) {
            var payload = notification.payload;
            console.log(notification, payload);
          },
          "onRegister": function(data) {
            console.log(data.token);
          },
          "pluginConfig": {
            "ios": {
              "badge": true,
              "sound": true
            },
            "android": {
              "senderID": "480713728381",
              "iconColor": "#343434"
            }
          }
        });

        push.register(function(token) {
          push.saveToken(token, { 'ignore_user': true });
          alert(token.token);
       TokenService.sendUserToken(null,token.token)
      $localstorage.setObject('token', token.token);
      console.log("Got Token:",token.token);
    });
    */
    /*  if($localstorage.getObject('token') === null && $localstorage.getObject('account') === null ) {
      console.log('NO USER!!');
      push.register(function(token) {
        push.saveToken(token, { 'ignore_user': true });
        alert(token.token);
    //  TokenService.sendUserToken(null,token.token)
    $localstorage.setObject('token', token.token);
    console.log("Got Token:",token.token);
});
    }
   if ($localstorage.getObject('token') === null && $localstorage.getObject('account') != null) {
      push.register(function(token) {
        alert(token.token);
        console.log("Device token:", token.token);
    //    TokenService.sendUserToken($localstorage.getObject('account').customer_id,token.token)
        $localstorage.setObject('token', token.token);
        push.saveToken(token, {'ignore_user': true}); // persist the token in the Ionic Platform
      });
    } else {
      console.log("Token set");
   }*/


    //Ionic push notification
    //device information

    var device = $cordovaDevice.getDevice();
    var model = $cordovaDevice.getModel();
    var platform = $cordovaDevice.getPlatform();
    var uuid = $cordovaDevice.getUUID();
    var version = $cordovaDevice.getVersion();
    console.log("Device " + device);

    $localstorage.setObject('deviceInfo', {
      device: device,
      model: model,
      platform: platform,
      uuid: uuid,
      version: version
    });
    //device information


    if ($localstorage.getObject('token') != null) {
      if ($localstorage.getObject('account') != null) {
        TokenService.sendUserToken($localstorage.getObject('account').customer_id, $localstorage.getObject('token'));
      } else {
        TokenService.sendUserToken(null, $localstorage.getObject('token'));
            }


    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      document.addEventListener("deviceready", function() {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        cordova.plugins.notification.badge.registerPermission(function(hasPermission) {
          // note that if this returns false the user has to switch permission on via the iOS Settings App
          //  alert("User has granted permission? " + hasPermission);
        });
      }, false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $ionicConfigProvider.form.toggle('small');
  $ionicConfigProvider.navBar.alignTitle('center');
  var startDate = new Date();
  startDate.setDate(startDate.getDate() + 2);

  var datePickerObj = {
    inputDate: startDate,
    setLabel: 'Выбрать',
    todayLabel: 'Сегодня',
    closeLabel: 'Закрыть',
    mondayFirst: true,
    weeksList: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    monthsList: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Август", "Сент", "Окт", "Ноя", "Дек"],
    templateType: 'popup',
    from: startDate,
    //to: new Date(2018, 8, 1)
    // showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false,
    disableWeekdays: [0, 6]
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.menu', {
      url: '/menu',
      views: {
        'tab-collection': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'MenuCtrl'
        }
      }
    })
    .state('tab.collection-category', {
      url: '/collection/:categoryId',
      views: {
        'tab-collection': {
          templateUrl: 'templates/collection-category.html',
          controller: 'CategoryCtrl'
        }
      }
    })

  .state('tab.collection-category-item', {
      url: '/collection/item/:itemId',
      views: {
        'tab-collection': {
          templateUrl: 'templates/collection-category-item.html',
          controller: 'ItemCtrl'
        }
      }
    })
    .state('tab.success', {
      url: '/success',
      views: {
        'tab-collection': {
          templateUrl: 'templates/tab-success.html',
          controller: 'SuccessOrderCtrl'
        }
      }
    })

  .state('tab.newfeature', {
      url: '/newfeature',
      views: {
        'tab-collection': {
          templateUrl: 'templates/tab-feature.html',
          controller: 'newFeatureCtrl'
        }
      }
    })
    .state('tab.search', {
      url: '/search/:searchString',
      views: {
        'tab-collection': {
          templateUrl: 'templates/collection-category.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('tab.collection-category-item-quantity', {
      url: '/collection/item/quantity/:itemId',
      views: {
        'tab-collection': {
          templateUrl: 'templates/collection-category-item-quantity.html',
          controller: 'ItemQuantityCtrl'
        }
      }
    })
    .state('tab.scanresult', {
      url: '/scanresult',
      views: {
        'tab-scan': {
          cache: false,
          templateUrl: 'templates/tab-scan-result.html',
          controller: 'BarcodeResultCtrl',
        }
      }
    })

  .state('tab.scan', {
    url: '/scan',
    views: {
      'tab-scan': {
        templateUrl: 'templates/tab-scan.html',
        controller: 'BarcodeCtrl',
        cache: false,
      }
    }
  })
  .state('tab.shoplist', {
      url: '/shoplist',
      views: {
        'tab-shop': {
          templateUrl: 'templates/tab-shoplist.html',
          controller: 'ShoplistCtrl'
        }
      }
    })
    .state('tab.singleShop', {
        url: '/shoplist/shop/:shopId',
        views: {
          'tab-shop': {
            templateUrl: 'templates/tab-shoplist.html',
            controller: 'ShoplistCtrlSingle'
          }
        }
      })
  .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.wishlist', {
      url: '/wishlist',
      views: {
        'tab-collection': {
          templateUrl: 'templates/wishlist.html',
          controller: 'WishlistCtrl'
        }
      }
    })
    .state('tab.cart', {
      url: '/cart',
      views: {
        'tab-collection': {
          templateUrl: 'templates/cart.html',
          controller: 'CartCtrl'
        }
      }
    })
    .state('tab.customer', {
      url: '/customer',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-customer.html',
          controller: 'CustomerCtrl'
        }
      }
    })
    .state('tab.user', {
      url: '/user',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-user.html',
          controller: 'UserCtrl'
        }
      }
    })
    .state('tab.scancustomercard', {
          url: '/scancard',
          views: {
            'tab-account': {
              templateUrl: 'templates/tab-scan.html',
              controller: 'DiscountCardScanCtrl'
            }
          }
        })
        .state('tab.orderHistory', {
          url: '/customer/orderHistory',
          views: {
            'tab-account': {
              templateUrl: 'templates/tab-orderHistory.html',
              controller: 'ordersHistoryListCtrl'
            }
          }
        })
        .state('tab.addadress', {
          url: '/customer/addadress',
          views: {
            'tab-account': {
              templateUrl: 'templates/tab-add-adress.html',
              controller: 'addAdressCtrl'
            }
          }
        })
    .state('tab.customercard', {
          url: '/card',
          views: {
            'tab-account': {
              templateUrl: 'templates/tab-discountCard.html',
              controller: 'DiscountCardCtrl'
            }
          }
        })
    .state('tab.adresses', {
      url: '/customer/adresses',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-adresses.html',
          controller: 'AdressesCtrl'
        }
      }
    })

  .state('tab.registration', {
    url: '/registration',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-registration.html',
        controller: 'RegistrationCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/menu');

});
