// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var handleOpenURL = function(url) {
  if(ionic.Platform.isIOS()){
    setTimeout(function() {
        window.localStorage.setItem('DEEPLINKCONTEST', "");
        var link = url.replace("getfash://", "");
        var result = link.split(':');
        if(result.length > 1){
            if(result[0] == "contest"){
              window.localStorage.setItem('DEEPLINKCONTEST', result[1]);
              window.location = "#/tab/home";
              window.location.reload();
            }
        }
    }, 0);
  }else{
    window.localStorage.setItem('DEEPLINKCONTEST', "");
    var link = url.replace("getfash://", "");
    var result = link.split(':');
    if(result.length > 1){
      if(result[0] == "contest"){
        window.localStorage.setItem('DEEPLINKCONTEST', result[1]);
        window.location = "#/tab/home";
        window.location.reload();
      }
    }
  }
};

angular.module('starter', ['ionic', 'jrCrop', 'ngCordova', 'ionicLazyLoad',
   'starter.controllers', 'controller.users', 'controller.stream', 'controller.item', 'controller.search', 'controller.itemproduct', 'controller.saved', 'controller.article', 'controller.notification', 'controller.intro', 'controller.more', 'controller.home', 
   'shared.modalloginsignup', 'user.services', 'stream.services', 'itemgroup.services', 'shared.modalprofile', 'factory.general', 'shared.modalcollection', 'shared.modaljoincontest', 'shared.modalunlockpromo', 'utils', 'models', 'databases', 'ngCordova', 'twitterLib', 'angular-preload-image', 'lokijs'])

.constant('AUTH_EVENTS', {
  NOTAUTHENTICATED: 'not-authenticated',
  AUTHENTICATED: 'authenticated',
  CURRFBID: 'CURRFBID',
  ISNEW: 'ISNEW',
  CURRFASHID: 'CURRFASHID',
  CURRFASHNAME: 'CURRFASHNAME',
  CURRFASHEMAIL: 'CURRFASHEMAIL',
  CURRFASHUSERNAME: 'CURRFASHUSERNAME',
  CURRDEVICESETTING: 'CURRDEVICESETTING',
  CURRFASHGENDER: 'CURRFASHGENDER',
  TWITTERTOKEN: 'TWITTERTOKEN',
  CURRTOKEN: 'CURRTOKENID',
  TWITTERKEY: 'TWITTER_KEY',
  CURRTWITTERID: 'CURRTWITTERID',
  CURRPROFILEPIC: 'CURRPROFILEPIC',
  CURRMOBILE: 'CURRMOBILE',
  FIRSTTIMELOADSAVED: 'FIRSTTIMELOADSAVED',
  FIRSTTIMELOADMORE: 'FIRSTTIMELOADMORE',
  ANDROIDDEVICEID: 'ANDROIDDEVICEID',
  SKIP: 'SKIP'
})

.constant('NOTIF', {
  N1: 'N1',
  N2: 'N2',
  N3: 'N3',
  N4: 'N4',
  N5: 'N5',
  N6: 'N6',
  N7: 'N7',
  N8: 'N8'
})

.constant('TWITTER_CONFIG', {
  oauthSettings: {
    consumerKey: 'Ty7iFryq6eKBl4azjy1Kqi1YN',
    consumerSecret: 'DiLmnQY9Un6NeiHSDuRwL67zV9uhnJOdVNEKfZeWsjs70P4hEt',
    requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    authorizationUrl: "https://api.twitter.com/oauth/authorize",
    accessTokenUrl: "https://api.twitter.com/oauth/access_token",
    callbackUrl: "callbackUrl"
  }
})

.constant('FACEBOOK_CONFIG', {
  SHAREARTICLELINK: 'https://www.getfash.com/{CATEGORY}/{SLUG}?utm_source=app&utm_medium=mobile&utm_campaign={ARTICLEID}',
  SHAREITEMLINK: 'https://www.getfash.com/item/detail/{ITEMID}?utm_source=app&utm_medium=mobile&utm_campaign={ITEMID}'
})

.constant('GENERAL_CONS', {
  IMGPHPATH: 'img/preloader.jpg',
  ARTICLEPH: 'img/article-ph.jpg',
  PROFILEPHPATH: 'img/profile-ph.png',
  MOREPRODUCTPHPATH: 'img/more-product.png',
  PRODUCTPHPATH: 'img/productplaceholder.jpg',
  CONTESTANT: 'C',
  DEFAULTLIMIT: 15,
  TABACTIVE: 'TABACTIVE',
  LOADNOTIF: 'LOADNOTIF',
  ISSAVEDONCE: 'ISSAVEDONCE',
  MAINLINK: 'https://www.getfash.com/'
})

.constant('API_INFO', {
  BASEURL: 'http://api.getfash.com', //prod
  //BASEURL: 'http://localhost:9000', //local
  //BASEURL: 'https://dev-getfashapi.herokuapp.com', //Staging
  //CLIENT_SECRET: 'test1234',
  //CLIENT_ID: 'testclient1'
  CLIENT_SECRET: '8FDABF3533B8A97BAFAF51EE36E67', //prod
  CLIENT_ID: '1F6D5E5EA3F17' //prod
})

.run(function($ionicPlatform, $state, $cordovaPush, $rootScope, $cordovaSQLite, $model, $localstorage, AUTH_EVENTS, GENERAL_CONS, LokiDB, AuthService, ItemGroupService) {
  $ionicPlatform.on('resume', function(){
      if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
        mixpanel.identify($localstorage.get(AUTH_EVENTS.CURRFASHID));
        mixpanel.people.set({
            "$email": $localstorage.get(AUTH_EVENTS.CURRFASHEMAIL),
            "$last_login": new Date(),
            "username": $localstorage.get(AUTH_EVENTS.CURRFASHUSERNAME),
            "$first_name": $localstorage.get(AUTH_EVENTS.CURRFASHNAME),
            "gender": $localstorage.get(AUTH_EVENTS.CURRFASHGENDER)
        });
      }

      //analytics              
      if(typeof analytics !== undefined) {
        analytics.trackView('Open App');
      }
  });

  $ionicPlatform.ready(function() {
    //mixpanel.init("581936cad37d684048c289da0b2e731c"); //staging
    mixpanel.init("96ae9f4f50cb8ad5bf57fba2b730cb20", {persistence: 'localStorage'}); //prod
         
    //analytics  
    if(typeof analytics !== undefined) {
      analytics.startTrackerWithId("UA-62197616-1");
      analytics.trackView('Open App');
    } else {
      console.log("Google Analytics Unavailable");
    }
 

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar){
      StatusBar.styleDefault();
    }

    //hide keyboard
    window.addEventListener('native.keyboardshow', function () {
      document.querySelector('div.tabs').style.display = 'none';
      angular.element(document.querySelector('ion-content.has-tabs')).css('bottom', 0);
    });
    window.addEventListener('native.keyboardhide', function () {
      var tabs = document.querySelectorAll('div.tabs');
      angular.element(tabs[0]).css('display', '');
    });

    //remove local storage temporary:
    /*$localstorage.destroy(AUTH_EVENTS.CURRFBID);
    $localstorage.destroy(AUTH_EVENTS.CURRTOKEN);
    $localstorage.destroy(AUTH_EVENTS.CURRFASHID);
    $localstorage.destroy(AUTH_EVENTS.CURRFASHNAME);
    $localstorage.destroy(AUTH_EVENTS.CURRFASHUSERNAME);
    $localstorage.destroy(AUTH_EVENTS.CURRFASHEMAIL);
    $localstorage.destroy(AUTH_EVENTS.CURRDEVICESETTING);
    $localstorage.destroy(AUTH_EVENTS.TWITTERKEY);
    $localstorage.destroy(AUTH_EVENTS.CURRMOBILE);
    $localstorage.destroy(AUTH_EVENTS.AUTHENTICATED);
    $localstorage.destroy(AUTH_EVENTS.CURRPROFILEPIC);
    $localstorage.destroy(AUTH_EVENTS.FIRSTTIMELOADSAVED);
    $localstorage.destroy(AUTH_EVENTS.FIRSTTIMELOADMORE);
    $localstorage.destroy(AUTH_EVENTS.CURRFASHGENDER);
    $localstorage.destroy(AUTH_EVENTS.ISNEW);*/
    //$localstorage.destroy(AUTH_EVENTS.SKIP);
    
    //temporary:
    //$localstorage.set(AUTH_EVENTS.CURRTOKEN, "MjlkOGI2MTctNjVjYS00YWQ3LTkyMjctZThjYjkwM2FhOTM5");
    //$localstorage.set(AUTH_EVENTS.CURRFASHID, "551b45147470bba254c50df1");
    //$localstorage.set(AUTH_EVENTS.AUTHENTICATED, true);
    //$localstorage.set(AUTH_EVENTS.SKIP, 1);
    //$localstorage.set(AUTH_EVENTS.FIRSTTIMELOADSAVED, 1)
    //$localstorage.set(AUTH_EVENTS.CURRMOBILE, "12341234");

    //Load needed data:
    LokiDB.initDB();
    if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
      LokiDB.getItemGroup().then(function(itemgroup){
        var promise = ItemGroupService.loadItemGroup("");
        promise.then(function(result){
          LokiDB.removeAllItemGroup();

          if(result != null){
            //set saved header:
            $localstorage.set(AUTH_EVENTS.CURRFASHNAME, result.fullname);
            if(result.profilepic != undefined){
              $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, result.profilepic.fullurl);
            }else{
              $localstorage.set(AUTH_EVENTS.CURRPROFILEPIC, GENERAL_CONS.PROFILEPHPATH);
            }
            
            var feed = result.itemgroup;
            for(var i = 0; i < feed.length; i++){
              var objToAdd = new $model.ItemGroup(feed[i]);
              LokiDB.addItemGroup(objToAdd);
            }
          }
        });
      });
    }else{
      LokiDB.getItemGroup().then(function(sv){});
    }

    LokiDB.getItemSaved().then(function(sv){
      LokiDB.removeAllItemSaved();
    });

    //get item:
    LokiDB.getItem().then(function(itm){});
  });

  //IOS
  /*document.addEventListener("deviceready", function(){

    var iosConfig = {
      "badge": true,
      "sound": true,
      "alert": true,
    };

    $cordovaPush.register(iosConfig).then(function(deviceToken) {
      // Success -- send deviceToken to server, and store for future use
      console.log("deviceToken: " + deviceToken);
      
      //register token:
      $localstorage.set(AUTH_EVENTS.ANDROIDDEVICEID, deviceToken);
      var promise = AuthService.doRegisterToken(deviceToken);
      promise.then(function(result){
        if(result){
          console.log("Device registered!");
        }
      });
    }, function(err) {
      console.log("Registration error: " + err);
    });

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      if (notification.alert) {
        if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
          $localstorage.set(GENERAL_CONS.LOADNOTIF, 1);
          window.location = '#/tab/more';
        }

        navigator.notification.alert(notification.alert);
      }

      if (notification.sound) {
        var snd = new Media(event.sound);
        snd.play();
      }

      if (notification.badge) {
        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
          // Success!
        }, function(err) {});
      }
    });
  });*/
  
  //ANDROID
  document.addEventListener("deviceready", function(){

    var androidConfig = {"senderID": "168159817821", 'alert': true,'icon': 'icon'};
    $cordovaPush.register(androidConfig).then(function(result) {
      // Success
      console.log("Device registered!" + result);
    }, function(err) {
      // Error
    });

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            console.log('registration ID = ' + notification.regid);
            //stored deviceid:
            $localstorage.set(AUTH_EVENTS.ANDROIDDEVICEID, notification.regid);
            var promise = AuthService.doRegisterToken(notification.regid);
            promise.then(function(result){
              if(result){
                console.log("Device registered!");
              }
            });
          }
          break;
        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          if (notification.foreground === false){
            //set local storage for load 
            if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
              $localstorage.set(GENERAL_CONS.LOADNOTIF, 1);
              window.location = '#/tab/more';
              window.location.reload();
            }
          }
          break;
        case 'error':
          console.log('GCM error = ' + notification.msg);
          break;
        default:
          console.log('An unknown GCM event has occurred');
          break;
      }
    });
  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('left');
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('tab.article-detail', {
    url: '/home/article/:articleID',
    views: {
      'tab-home': {
        templateUrl: 'templates/article/detail.html',
        controller: 'ArticleCtrl'
      }
    }
  })
  .state('tab.item-detail', {
    url: '/home/article/item/:itemID',
    views: {
      'tab-home': {
        templateUrl: 'templates/item/detail.html',
        controller: 'ItemCtrl'
      }
    }
  })
  .state('tab.item-detail-product-more', {
    url: '/home/article/product/:itemID',
    views: {
      'tab-home': {
        templateUrl: 'templates/item/itemproduct.html',
        controller: 'ItemProductCtrl'
      }
    }
  })
  .state('tab.article-category', {
    url: '/home/articlecategory/:catID',
    views: {
      'tab-home': {
        templateUrl: 'templates/article/articlecategory.html',
        controller: 'ArticleCategoryCtrl'
      }
    }
  })

  .state('tab.saved', {
    url: '/saved',
    views: {
      'tab-saved': {
        templateUrl: 'templates/tab-saved.html',
        controller: 'SavedCtrl'
      }
    }
  })
  .state('tab.item-saved', {
    url: '/saved/:groupID/:groupName',
    views: {
      'tab-saved': {
        templateUrl: 'templates/saved/itemsaved.html',
        controller: 'ItemSavedCtrl'
      }
    }
  })
  .state('tab.item-saved-detail', {
    url: '/saved/zoomin/:groupID/:itemID',
    views: {
      'tab-saved': {
        templateUrl: 'templates/saved/itemsaveddetail.html',
        controller: 'ItemSavedDetailCtrl'
      }
    }
  })
  .state('tab.item-saved-product-more', {
    url: '/saved/zoomin/product/:itemID',
    views: {
      'tab-saved': {
        templateUrl: 'templates/item/itemproduct.html',
        controller: 'ItemProductCtrl'
      }
    }
  })

  .state('tab.more', {
    url: '/more',
    views: {
      'tab-more': {
        templateUrl: 'templates/tab-more.html',
        controller: 'MoreCtrl'
      }
    }
  })
  .state('tab.more-profile', {
    url: '/more/profile',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/editprofile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('tab.more-rewards', {
    url: '/more/rewards',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/rewards.html',
        controller: 'RewardCtrl'
      }
    }
  })
  .state('tab.more-password', {
    url: '/more/password',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/changepassword.html',
        controller: 'ChangePasswordCtrl'
      }
    }
  })
  .state('tab.more-setting', {
    url: '/more/setting',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/setting.html',
        controller: 'SettingCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })
  .state('tab.search-article-detail', {
    url: '/search/article/:articleID',
    views: {
      'tab-search': {
        templateUrl: 'templates/article/detail.html',
        controller: 'ArticleCtrl'
      }
    }
  })
  .state('tab.search-item-detail', {
    url: '/search/article/item/:itemID',
    views: {
      'tab-search': {
        templateUrl: 'templates/item/detail.html',
        controller: 'ItemCtrl'
      }
    }
  })
  .state('tab.search-item-detail-product-more', {
    url: '/search/article/product/:itemID',
    views: {
      'tab-search': {
        templateUrl: 'templates/item/itemproduct.html',
        controller: 'ItemProductCtrl'
      }
    }
  })
  .state('tab.search-article-category', {
    url: '/search/articlecategory/:catID',
    views: {
      'tab-search': {
        templateUrl: 'templates/article/articlecategory.html',
        controller: 'ArticleCategoryCtrl'
      }
    }
  })

  .state('tab.more-notification', {
    url: '/more/notification',
    views: {
      'tab-more': {
        templateUrl: 'templates/more/notification.html',
        controller: 'NotificationCtrl'
      }
    }
  })
  .state('tab.more-article-detail', {
    url: '/more/notification/article/:articleID',
    views: {
      'tab-more': {
        templateUrl: 'templates/article/detail.html',
        controller: 'ArticleCtrl'
      }
    }
  })
  .state('tab.more-item-detail', {
    url: '/more/notification/article/item/:itemID',
    views: {
      'tab-more': {
        templateUrl: 'templates/item/detail-notification.html',
        controller: 'ItemCtrl'
      }
    }
  })
  .state('tab.more-article-category', {
    url: '/more/notification/articlecategory/:catID',
    views: {
      'tab-more': {
        templateUrl: 'templates/article/articlecategory.html',
        controller: 'ArticleCategoryCtrl'
      }
    }
  })
  .state('tab.more-item-detail-product-more', {
    url: '/more/notification/article/product/:itemID',
    views: {
      'tab-more': {
        templateUrl: 'templates/item/itemproduct.html',
        controller: 'ItemProductCtrl'
      }
    }
  })
  .state('tab.stream', {
    url: '/stream',
    views: {
      'tab-stream': {
        templateUrl: 'templates/tab-stream.html',
        controller: 'StreamCtrl'
      }
    }
  })
  .state('tab.stream-item-detail', {
    url: '/stream/article/item/:itemID',
    views: {
      'tab-stream': {
        templateUrl: 'templates/item/detail-notification.html',
        controller: 'ItemCtrl'
      }
    }
  })
  .state('tab.stream-item-detail-product-more', {
    url: '/stream/article/product/:itemID',
    views: {
      'tab-stream': {
        templateUrl: 'templates/item/itemproduct.html',
        controller: 'ItemProductCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/home');
})
.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_system', 'closebuttoncaption=Done,toolbarposition=top')\"");
        return $sce.trustAsHtml(newString);
    }
});
