angular.module('customer.controller', [])

  .controller('CustomerCtrl', function($scope, $location, $ionicHistory, $localstorage, $stateParams, $cordovaGoogleAnalytics, $ionicPlatform) {

    console.log('Start CustomerCtrl');
    /*Analytics Tracking START*/
    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('Customer');
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
      $scope.cartItems = 0;
    } else {
      $scope.shoppingCartStatusFull = 1;
      $scope.cartItems = $localstorage.getObject('shoppingCart')['items'].length;

    }


    $ionicHistory.nextViewOptions({
      disableBack: false
    });
    var account = $localstorage.getObject('account');
    if (account.customer_id == null) {
      $location.path("/tab/account");

    }

    $scope.account = $localstorage.getObject('account');
    $scope.logout = function() {
      $localstorage.deleteAll();
      $location.path("/tab/menu");
      $ionicHistory.clearHistory();
    };

  })
  .controller('AdressesCtrl', function($scope, $location, $ionicHistory, $localstorage, $stateParams, $cordovaGoogleAnalytics,
                                        $ionicListDelegate, $localstorage, adressesService, EditAdressService) {

    /*Analytics Tracking START*/
    function _waitForAnalytics() {
      if (typeof analytics !== 'undefined') {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
        $cordovaGoogleAnalytics.trackView('adresses View');
      } else {
        setTimeout(function() {
          _waitForAnalytics();
        }, 250);
      }
    };
    _waitForAnalytics();
    /*Analytics Tracking END*/
      $scope.onTabSelected = function() {
        $state.go('tab.customer');
      }

      $scope.edit = function(item) {
        EditAdressService.setAdress(item);
          $location.path("/tab/customer/addadress");
      //  alert('Edit Item: ' + item.id);
      };

      $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.adresses.splice(fromIndex, 1);
        $scope.adresses.splice(toIndex, 0, item);
      };

      $scope.onItemDelete = function(item) {
          var del_item=item.address_id;
        adressesService.deleteAdress(del_item, customer_id).success(function(response) {
          if (response.success == true) {
            delete $scope.adresses[del_item];
          }else {
            $scope.error=response.error;
            console.log(response.success);
          }
        });
      };


      if ($localstorage.getObject('account') != null) {
        var customer_id = $localstorage.getObject('account').customer_id;
        adressesService.getadresses(customer_id).success(function(response) {

          if (response.success == true) {

            $scope.adresses = response.adresses;

          } else {
            console.log('false');
            $scope.error = true;
          }
        });
      } else {
        $scope.error = true;
      }
    })

.controller('addAdressCtrl', function($cordovaGoogleAnalytics, $localstorage, $scope, $location,
                                      $state, $window, getRegionsService, headerIconsService,
                                      adressesService, EditAdressService) {
  //начальные состояния иконок корзины и wishlist
  headerIconsService.getIconStatuses();
  /*Analytics Tracking START*/
  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('add adress View');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();
  /*Analytics Tracking END*/
  var country_id = 176;
  var editedAdress = EditAdressService.getAdress();
  if(editedAdress == null) {
  $scope.data = {};
  $scope.data.country_id = country_id;
  //Moscow
  $scope.data.zone_id = 2761;
}else {
  console.log(editedAdress);
  $scope.data =editedAdress;
}
  getRegionsService.getZones(country_id).success(function(response) {
    $scope.zones = response.zones;
  });
  $scope.data.default =true;
  if ($localstorage.getObject('account') != null) {
  $scope.data.customer_id=$localstorage.getObject('account').customer_id;
  $scope.data.firstname=$localstorage.getObject('account').firstname;
  $scope.data.lastname=$localstorage.getObject('account').lastname;
}
  // function to submit the form after all validation has occurred
  $scope.submitForm = function(isValid) {
    console.log('validation start');
    $scope.submitted = true;
    // check to make sure the form is completely valid
    if (isValid) {
      
      EditAdressService.setAdress();
      console.log('form Valid!');
      //console.log();
      //$scope.data.country_id= 176;
      adressesService.register($scope.data).then(function(data) {
        $scope.result = data;

        if (data.data.success == true) {

            //пользователь установил флажек что хочет использовать данный адрес в качестве основного
          if($scope.data.default == true){
          var accData= $localstorage.getObject('account');
            //выставляем адрес в качестве основного
          accData.address_id = data.data.address_id;
            $localstorage.setObject('account', accData);
        }
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
