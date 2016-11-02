'use strict';

MyApp.controller('UserSignUp', ['$scope', '$rootScope', '$timeout', '$state', 'UserService', 'ConfigService', '$ionicLoading',
  function($scope, $rootScope, $timeout, $state, UserService, ConfigService, $ionicLoading) {
  /**
   * After 1 sec redirect to signup_1 page
   */

  UserService.restoreAuth().then(function (authData) {
    if (!UserService.isAuthorized()) {
      $timeout(function() {
        $rootScope.debugInfo({"m":'signup - NOT authorized'});
        $state.go('signup_step1');

        $timeout(function () {
          $ionicLoading.hide();
        }, 50);
      }, ConfigService.signupPageTimeout);
    }
  },
  function (error) {
    console.log('error on restore auth 3: ', error);
  });
}]);

MyApp.controller('UserCtrl', [ '$scope',
  '$rootScope',
  '$window',
  '$state',
  '$timeout',
  '$ionicModal',
  '$ionicPopup',
  '$ionicLoading',
  '$cordovaDevice',
  'CountryCodeService',
  'NotificationService',
  'SettingsService',
  'UserService',
  'UnreadNotificationsService',
  '_',
  function ($scope,
           $rootScope,
           $window,
           $state,
           $timeout,
           $ionicModal,
           $ionicPopup,
           $ionicLoading,
           $cordovaDevice,
           CountryCodeService,
           NotificationService,
           SettingsService,
           UserService,
           UnreadNotificationsService,
           _) {

  $scope.signupData = {
    username: "",
    image: "",
    countryCode: UserService.getCountryCodeTmp() || _.first(CountryCodeService.getCountryCode()),
    phone: UserService.getPhoneNumberTmp(),
    country: ""
  };

  $scope.errors = {
    usernamePattern: false
  };

  var usernamePattern = new RegExp(/^[0-9A-Za-z\. \_]+$/gmi);

  $scope.$watch('signupData.profilename', function(newVal, oldVal){
    if($scope.signupData.profilename && $scope.signupData.profilename.replace) {
      $scope.signupData.profilename = $scope.signupData.profilename.replace(/ /g, '_');
      $scope.errors.usernamePattern = !$scope.signupData.profilename.match(usernamePattern);
    }
  });

  $scope.countries = CountryCodeService.getCountryCode();
  $scope.texto = 'Hello World!';

  function isUserDataValid() {
    if(!$scope.signupData.profilename.match(usernamePattern)
      || $scope.signupData.profilename.length < 2
      || $scope.signupData.profilename.length > 25
      || $scope.signupData.username.length < 2
      || $scope.signupData.username.length > 25 ) {
      return false;
    }

    return true;
  }

  $scope.signUp = function(){
    if (!$scope.signupData.username) {
      return window.plugins.toast.showShortCenter('Profile name is required field');
    }

    if (!$scope.signupData.profilename) {
      return window.plugins.toast.showShortCenter('User name is required field');
    }

    if(!$scope.signupData.profilename.match(usernamePattern)) {
      $scope.errors.usernamePattern = true;
      return;
    }

    if(!isUserDataValid()) {
      return;
    }

    var data = {
      countryCode: UserService.getCountryCodeTmp().value,
      phone:       UserService.getPhoneNumberTmp(),
      username:    $scope.signupData.username,
      profilename: $scope.signupData.profilename,
      country:     UserService.getCountryCodeTmp().key,
      image:       $scope.signupData.image
    };

    UserService.signUpUser(data).then(function(response){
      if(response.status == "success") {
        UserService.loginUser().then(function(response) {
          UserService.setAuthData({
            id: response.user._id,
            country: response.user.country,
            token: response.token,
            isAuth: true,
            type: 'mobile',
            pic: response.user.pic
          });

          $rootScope.unreadMessages = response.user.unread_messages;
          $rootScope.unreadGroupsNotifications = response.user.unread_group_notifications;
          UnreadNotificationsService.init();

          NotificationService.initPushwoosh().then(function (pushToken) {
            SettingsService.updateDevice({"pushwooshtoken": pushToken}).then(function () {
              NotificationService.setBadge($rootScope.unreadMessages + $rootScope.unreadGroupsNotifications);

              UserService.restoreLastScreen();
            });
          }, function (error) {
            window.plugins.toast.showShortCenter('Can\'t update device token for push notifications', function(a){
            }, function(b){
              console.log('toast error: ' + b)
            });
            $rootScope.debugInfo(error);
            UserService.restoreLastScreen();
          });
        })
      } else {
        if(response.code && response.code === 409) {
          userNameIsNotUniq(response.message);
        } else {
          window.plugins.toast.showShortCenter(response.message, function(a){
            console.log('toast success: ' + a);
          }, function(b){
            alert('toast error: ' + b)
          });
        }
      }
    });
  };

  $scope.saveDevice = function() {

    $ionicLoading.show({
      template: '<p> Loading </p> <i class="icon ion-loading-c" style="color:#ffffff;" ></i>'
    });
    /**
     * Populate data for other page
     */
    UserService.setPhoneNumberTmp($scope.signupData.phone);
    UserService.setCountryCodeTmp($scope.signupData.countryCode);

    $scope.signupData.country = $scope.signupData.countryCode.key;

    try {
      var deviceData = JSON.parse(JSON.stringify($scope.signupData));
      deviceData.countryCode = $scope.signupData.countryCode.value;
    } catch(err) {
      return window.plugins.toast.showShortCenter('can not save device data!', function(a){
        console.log('toast success: ' + a);
      }, function(b){
        alert('can not save device data!');
      });
    }


    UserService.saveDevice(deviceData, $cordovaDevice.getUUID()).then(function(response) {

      $ionicLoading.hide();
      if(response.status == "success") {
        $state.go('confirm');
      } else {
        window.plugins.toast.showShortCenter(response.message, function(a){
          console.log('toast success: ' + a);
        }, function(b){
          alert('toast error: ' + b);
        });
      }
    })
  }

  $scope.step1 = function(){
    $rootScope.debugInfo({"m":'signup - function - step 1'});
    $state.go('signup_step1');
  };

  $scope.step3 = function(){
    $state.go('signup_step3');
  };

  function isValidNumber() {
    var valid = true;

    if (!$scope.signupData.countryCode.value.length || !$scope.signupData.phone.length) {
      valid = false;
    } else if (/[^\d\+]/.test($scope.signupData.phone)) {
      valid = false;
    } else if (_.indexOf(_.pluck(CountryCodeService.getCountryCode(), 'value'), $scope.signupData.countryCode.value) === -1 ) {
      valid = false;
    }

    return valid;
  }

  function userNameIsNotUniq(title) {
    $ionicPopup.alert({
      title: title,
      cssClass: "username-err"
    });
  }

  var myPopup;
  $scope.showPopup = function(){

    if ($window.cordova
      && $window.cordova.plugins.Keyboard
      && $window.cordova.plugins.Keyboard.isVisible
    ) {
      cordova.plugins.Keyboard.close();
    }

    if (!isValidNumber()) {
      return window.plugins.toast.showShortCenter('Please enter your phone number and country code');
    }

    myPopup = $ionicPopup.show({
      template: '<div class="confirmation_text_box"><div class="confirm_text">Is this your correct number ?</div><div class="check_number"><span class="confirm_code">(' + $scope.signupData.countryCode.value + ') </span><span class="confirm_no">' + $scope.signupData.phone + '</span></div><div class="instruction_text">An access code will be sent to this number.</div></div><div class="clear"></div>',
      cssClass: 'confirmation_popup',
      scope: $scope,
      buttons: [
        { text: '<div class="confirm_number">Edit</div>',
          type: 'button-positive',
          onTap: function(e) {
            UserService.setPhoneNumberTmp($scope.signupData.phone);
            UserService.setCountryCodeTmp($scope.signupData.countryCode);
          }
        },
        {
          text: '<div class="confirm_number">OK</div>',
          type: 'button-positive',
          onTap: function(e) {
            $scope.saveDevice();
          }
        }
      ]
    });
  };

  $scope.uploadPicture = function() {
    $ionicLoading.show({
      template: 'Uploading...'
    });

    SettingsService.uploadCropImage('AVATAR', null, 'avatar', true).then(function(response){
      $ionicLoading.hide();
      if(response.status === 'success'){
        $scope.signupData.image = response.url_file;
      } else {
        window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('toast error: ' + b)
        });
      }
    }, function(err) {
      $ionicLoading.hide();
    });
  };

  $scope.getAvatar = function() {
    return $scope.signupData.image || 'img/add_photo.png';
  }

  function closePop(){
    myPopup.close();
  }
}]);

MyApp.controller('UserCtrlConfirm', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$state',
  '$window',
  '$ionicModal',
  '$ionicPopup',
  '$ionicLoading',
  '$cordovaDevice',
  'NotificationService',
  'SettingsService',
  'UserService',
  'UnreadNotificationsService',
  function ($scope, $rootScope, $timeout, $state, $window, $ionicModal, $ionicPopup, $ionicLoading, $cordovaDevice, NotificationService, SettingsService, UserService, UnreadNotificationsService) {

  $scope.formData = {
    code : ""
  };

  function login(user) {
    $rootScope.debugInfo({'m':'login1'});
    UserService.setAuthData({
      id: user._id,
      country: user.country,
      username: user.username,
      mobilenumber: user.mobilenumber,
      isAuth:false,
      pic: user.pic
    });

    UserService.loginUser().then(function(response) {
      $rootScope.debugInfo({"m":'login2',"d": response});
      UserService.setAuthData({
        id: response.user._id,
        country: response.user.country,
        token: response.token,
        isAuth: true,
        type: 'mobile',
        pic: response.user.pic
      });

      $rootScope.unreadMessages = response.user.unread_messages;
      $rootScope.unreadGroupsNotifications = response.user.unread_group_notifications;
      UnreadNotificationsService.init();

      NotificationService.initPushwoosh().then(function (pushToken) {
        NotificationService.setBadge($rootScope.unreadMessages + $rootScope.unreadGroupsNotifications);
        $rootScope.debugInfo({"m":'login3',"d": pushToken});
        SettingsService.updateDevice({"pushwooshtoken": pushToken}).then(function () {
          $ionicLoading.hide();

          UserService.restoreLastScreen();
        });
      }, function (error) {
        $ionicLoading.hide();

        window.plugins.toast.showShortCenter('Can\'t register for push notifications', function (a) {
          }, function (b) {
            console.log('toast error: ' + b)
          });

        $rootScope.debugInfo({"m":'pushwoosherror',"d": error});
        UserService.restoreLastScreen();
      });
    })
  }

    $scope.isWaitingTimeGone = false;
    $scope.isWaitingTimeGoneTimer = $timeout(function() {
      $scope.isWaitingTimeGone = true;
    }, 15*1000);

  $scope.init = function () {
    $scope.mobilenumber = UserService.getCountryCodeTmp().value + UserService.getPhoneNumberTmp();
  };
  // init method
  $scope.init();

  $scope.confirm = function() {

    $timeout.cancel( $scope.isWaitingTimeGoneTimer );

    if ($window.cordova
      && $window.cordova.plugins.Keyboard
      && $window.cordova.plugins.Keyboard.isVisible
    ) {
      cordova.plugins.Keyboard.close();
    }

    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c" style="color:#ffffff;" ></i>'
    });

    var data = {
      device_id: $cordovaDevice.getUUID(),
      mobilenumber: $scope.mobilenumber
    };

    UserService.confirmUser(data, $scope.formData.code).then(function(response){
      $rootScope.debugInfo({"m":'confirm2',"d": response});
      if (response.status == "success") {
        /**
         * If user exists, login
         */
        if (response.userExists) {
          return login(response.user);
        } else {
          $ionicLoading.hide();
          $state.go('signup_step3');
        }
      } else {
        $ionicLoading.hide();
        window.plugins.toast.showShortCenter(response.message, function(a){
          console.log('toast success: ' + a)
        }, function(b){
          alert('toast error: ' + b)
        });
      }
    }, function (error) {
      $ionicLoading.hide();
      $rootScope.debugInfo({"m":'confirm2-error',"d": error});
    });
  }
}]);
