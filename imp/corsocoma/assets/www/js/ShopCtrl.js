angular.module('shop.controller', [])
  .controller('ShoplistCtrl', function($scope, $location, $localstorage, $cordovaGoogleAnalytics,
                                        $cordovaLaunchNavigator, $ionicLoading, ShopListService, $stateParams) {
    /*Analytics Tracking START*/
  /*  $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };
*/

$scope.onTabSelected = function() {
  $state.go('tab.shoplist');
};
    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Shop list controller');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    $ionicLoading.show({
        content: 'Загрузка',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    var onSuccess = function(position) {

      $localstorage.setObject('position', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });


      ShopListService.shopList().then(function(data) {
           $ionicLoading.hide();
       $scope.shopList = data.shoplist;
       console.log(data.shoplist);
       });
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
      $ionicLoading.hide();
      $localstorage.setObject('position', {

        code: error.code,
        message: error.message
      });
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
              ShopListService.shopList().then(function(data) {
               $scope.shopList = data.shoplist;
               console.log(data.shoplist);
               });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    $scope.launchNavigator = function(latitude, longitude) {
    var destination = [latitude, longitude];
    if($localstorage.getObject('position') != null && $localstorage.getObject('position').latitude != null && $localstorage.getObject('position').longitude != null) {
    var start = [$localstorage.getObject('position').latitude,  $localstorage.getObject('position').longitude];
  }else {
    var start = 'Moscow';
  }
    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
      console.log("Navigator launched");
    }, function (err) {
      console.error(err);
    });
  };


    document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log("navigator.geolocation works well");
        }


  })
  .controller('ShoplistCtrlSingle', function($scope, $location, $window,   $ionicHistory, $stateParams, $localstorage, $cordovaGoogleAnalytics,
                                        $cordovaLaunchNavigator, $ionicLoading, ShopListService ) {
    /*Analytics Tracking START*/
  /*  $scope.onTabSelected = function() {
      $state.go('tab.menu');
    };
  */
  $ionicHistory.clearHistory();
  $scope.onTabSelected = function() {
  $state.go('tab.shoplist');
  };

    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Shop list controller');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    $ionicLoading.show({
        content: 'Загрузка',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });


    var onSuccess = function(position) {

      $localstorage.setObject('position', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
$scope.shopList = [];
var ShopID =  $stateParams.shopId;
      ShopListService.shopList().then(function(data) {
           $ionicLoading.hide();
       //$scope.shopList = data.shoplist;
         for (var s = 0; s < data.shoplist.length; ++s) {
           if (data.shoplist[s].one_c_shop_id == ShopID) {

             $scope.shopList.push({
               phone: data.shoplist[s].phone,
               name: data.shoplist[s].name,
               city: data.shoplist[s].city,
               adress: data.shoplist[s].adress,
              distance: data.shoplist[s].distance,
              latitude: data.shoplist[s].latitude,
              longitude: data.shoplist[s].longitude

             })

           }
         }



       console.log(data.shoplist);
       });
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        $ionicLoading.hide();
      $localstorage.setObject('position', {
        code: error.code,
        message: error.message
      });
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
              ShopListService.shopList().then(function(data) {
               $scope.shopList = data.shoplist;
               console.log(data.shoplist);
               });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    $scope.launchNavigator = function(latitude, longitude) {
    var destination = [latitude, longitude];
    if($localstorage.getObject('position') != null && $localstorage.getObject('position').latitude != null && $localstorage.getObject('position').longitude != null) {
    var start = [$localstorage.getObject('position').latitude,  $localstorage.getObject('position').longitude];
  }else {
    var start = 'Moscow';
  }
    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
      console.log("Navigator launched");
    }, function (err) {
      console.error(err);
    });
  };


    document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log("navigator.geolocation works well");
        }


  })
  ;
