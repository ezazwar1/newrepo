angular.module('controller.more', ['factory.countries', 'reward.services'])
.controller('MoreCtrl', function($scope, $helper, $ionicPlatform, $state, LokiDB, AUTH_EVENTS, $localstorage, GENERAL_CONS, ModalLoginSignupService) {
    $scope.backToHome = true;
    $scope.title = "<div class='short-logo'><img src='img/logo-short.png' /> MY PROFILE</div>";
    $scope.profilePic = "";
    $scope.noLoggedInView = true;

    $ionicPlatform.ready(function() {
      if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
        $scope.profilePic = $localstorage.get(AUTH_EVENTS.CURRPROFILEPIC);
        $scope.noLoggedInView = true;
      }else{
        $scope.noLoggedInView = false;
      }
    });

    $scope.$on('$ionicView.beforeEnter', function() {
      $localstorage.set(GENERAL_CONS.TABACTIVE, 5);

      if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
        $scope.noLoggedInView = true;
      }else{
        $scope.noLoggedInView = false;
      }

      //first time load:
      if($localstorage.get(AUTH_EVENTS.FIRSTTIMELOADMORE) == 1){
        if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
          $scope.profilePic = $localstorage.get(AUTH_EVENTS.CURRPROFILEPIC);
          $scope.noLoggedInView = true;
        }else{
          $scope.noLoggedInView = false;
        }
        $localstorage.set(AUTH_EVENTS.FIRSTTIMELOADMORE, 0);
      }
    });

    $scope.goToProfile = function(){
      $state.go('tab.more-profile');
    }

    $scope.goToRewards = function(){
      $state.go('tab.more-rewards');
    }

    $scope.goToNotification = function(){
      $state.go('tab.more-notification');
    }

    $scope.goToChangePassword = function(){
      $state.go('tab.more-password');
    }

    $scope.goToChallengeRules = function(){
      window.open('https://www.getfash.com/info/contestrules.html', '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }

    $scope.goToSettings = function(){
      $state.go('tab.more-setting');
    }

    $scope.goToLogin = function(){
      ModalLoginSignupService
      .init($scope, false)
      .then(function(modal) {
        modal.show();
      });
    }

    $scope.doLogout = function(){
      $helper.showLoader();

      $localstorage.destroy(AUTH_EVENTS.CURRFBID);
      $localstorage.destroy(AUTH_EVENTS.CURRTOKEN);
      $localstorage.destroy(AUTH_EVENTS.CURRFASHID);
      $localstorage.destroy(AUTH_EVENTS.CURRFASHNAME);
      $localstorage.destroy(AUTH_EVENTS.CURRDEVICESETTING);
      $localstorage.destroy(AUTH_EVENTS.TWITTERKEY);
      $localstorage.destroy(AUTH_EVENTS.CURRMOBILE);
      $localstorage.destroy(AUTH_EVENTS.AUTHENTICATED);
      $localstorage.destroy(AUTH_EVENTS.CURRPROFILEPIC);
      $localstorage.destroy(AUTH_EVENTS.FIRSTTIMELOADSAVED);
      $localstorage.destroy(AUTH_EVENTS.FIRSTTIMELOADMORE);
      $localstorage.destroy(AUTH_EVENTS.CURRFASHEMAIL);
      $localstorage.destroy(AUTH_EVENTS.CURRFASHUSERNAME);
      $localstorage.destroy(AUTH_EVENTS.CURRFASHGENDER);

      if($localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
        LokiDB.getSavedSet().then(function(savedset){
          LokiDB.removeAllSavedSet();
        });
      }

      LokiDB.getSetting().then(function(sv){
        LokiDB.removeAllSetting();
      });

      LokiDB.getSavedMedia().then(function(sv){
        LokiDB.removeAllSavedMedia();
      });

      //init media:
      LokiDB.getMedia().then(function(sv){
        LokiDB.removeAllMedia();
      });

      $state.go('tab.home');

      $helper.hideLoader();
    }
})

.controller('ProfileCtrl', function($scope, $ionicPopup, $ionicPlatform, Countries, AuthService, ModalUpdateProfilePicService, GENERAL_CONS, ionicToast) {

    $scope.countries = Countries.get();
    $scope.blockDone = true;
    $scope.users = {
      fullname: '',
      gender: '',
      username: '',
      country: '',
      sizes: {
        bustvalue: 0,
        busttype: 'inch',
        waistvalue: 0,
        waisttype: 'inch',
        hipvalue: 0,
        hiptype: 'inch',
        shouldervalue: 0,
        shouldertype: 'inch'
      },
      sizing: []
    };

    $ionicPlatform.ready(function() {
      //get latest data from server:
      var promise = AuthService.loadProfileData();
      promise.then(function(result){
        if(result != null){
          $scope.users.fullname = result.fullname;

          //sizes setting:
          if(result.settings != undefined){
            if(result.settings.sizing.length > 0){
              var sizing = result.settings.sizing;
              for(var i = 0 ; i < sizing.length ; i++){
                if(sizing[i].measurement == 2){
                  $scope.users.sizes.bustvalue = sizing[i].value;
                  $scope.users.sizes.busttype = sizing[i].measurementtype;
                }else if(sizing[i].measurement == 3){
                  $scope.users.sizes.waistvalue = sizing[i].value;
                  $scope.users.sizes.waisttype = sizing[i].measurementtype;
                }else if(sizing[i].measurement == 4){
                  $scope.users.sizes.hipvalue = sizing[i].value;
                  $scope.users.sizes.hiptype = sizing[i].measurementtype;
                }else if(sizing[i].measurement == 5){
                  $scope.users.sizes.shouldervalue = sizing[i].value;
                  $scope.users.sizes.shouldertype = sizing[i].measurementtype;
                }
              }
            }
          }

          if(result.gender == undefined){
            $scope.users.gender = "";
          }else{
            $scope.users.gender = result.gender;
          }

          $scope.users.username = result.username;

          if(result.country == undefined){
            $scope.users.country = "";
          }else{
            $scope.users.country = result.country;
          }

          if(result.profilepicurl != undefined && result.profilepicurl != ""){
            $scope.profilepic = result.profilepicurl.fullurl;
          }else{
            $scope.profilepic = GENERAL_CONS.PROFILEPHPATH;
          }

          $scope.blockDone = false;
        }
      });
    });

    $scope.title = "<div class='general-title'>Edit Profile</div>";

    $scope.doUpdate = function(){
      $scope.blockDone = true;
      if($scope.users.username == ""){
        $ionicPopup.alert({
           title: 'Edit Profile',
           subTitle: 'Please choose a username'
        });
        $scope.blockDone = false;
      }else if($scope.users.fullname == ""){
        $ionicPopup.alert({
           title: 'Edit Profile',
           subTitle: 'Please fill in your fullname'
        });
        $scope.blockDone = false
      }else{
        //prepare sizing:
        $scope.users.sizing.push({"measurement":2, "value":$scope.users.sizes.bustvalue, "measurementtype":$scope.users.sizes.busttype });
        $scope.users.sizing.push({"measurement":3, "value":$scope.users.sizes.waistvalue, "measurementtype":$scope.users.sizes.waisttype });
        $scope.users.sizing.push({"measurement":4, "value":$scope.users.sizes.hipvalue, "measurementtype":$scope.users.sizes.hiptype });
        $scope.users.sizing.push({"measurement":5, "value":$scope.users.sizes.shouldervalue, "measurementtype":$scope.users.sizes.shouldertype });

        var promise = AuthService.doEditProfile($scope.users.fullname, $scope.users.gender, $scope.users.username, $scope.users.country, $scope.users.sizing);
        promise.then(function(result){
          $scope.blockDone = false;
          if(result != "ERR"){
            if(result.code != "200"){
              $ionicPopup.alert({
                 title: 'Edit Profile',
                 subTitle: result.message
              });
            }else{
              ionicToast.show('UPDATED', 'top', false, 1000);
            }
          }else{
            //failed to update:
            $ionicPopup.alert({
               title: 'Edit Profile',
               subTitle: 'Failed to update profile'
            });
          }
        });
      }
    };

    $scope.uploadProfile = function(){
      //$scope.profilepic = "http://localhost:8000/assets/img/brands/janice.png";
      ModalUpdateProfilePicService
        .init($scope)
        .then(function(modal){
          modal.show();
        });
    }
})

.controller('RewardCtrl', function($scope, $model, $localstorage, $cordovaClipboard, $ionicPopup, $helper, $ionicPlatform, RewardService, ModalUpdateProfilePhoneService, GENERAL_CONS, AUTH_EVENTS, ionicToast) {

  $scope.rewards = [];

  $scope.displayRewardEmpty = false;
  $scope.rewardLoader = false;

  //pagination:
  $scope.limit = GENERAL_CONS.DEFAULTLIMIT;
  $scope.max_id = "";
  $scope.loadmore = true;

  $ionicPlatform.ready(function() {
    $scope.rewardLoader = true;

    var promise = RewardService.loadGifts("", "");
    promise.then(function(result){
      if(result != null){
        $scope.rewards = []; //reset

        addFeed(result);
        managePagination(result.pagination);
      }else{
        $scope.displayRewardEmpty = true;
      }

      $scope.rewardLoader = false;
    });

  });

  var managePagination = function(pagination){
    if(pagination != undefined){
      $scope.rw_max_id = pagination.next_max_id;

      if($scope.max_id != ""){
        $scope.loadmore = true;
      }
    }
  }

  $scope.doReloadReward = function() {
    var promise = RewardService.loadGifts("", "");
    promise.then(function(result) {
      if(result != null){
        $scope.rewards = []; //reset
        $scope.max_id = "";
        $scope.loadmore = true;

        addFeed(result);
        managePagination(result.pagination);
      }else{
        $scope.displayRewardEmpty = true;
      }

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreReward = function(){
    $scope.loadmore = false;
    if($scope.max_id != ""){
      var promise = RewardService.loadGifts($scope.max_id, $scope.limit);
      promise.then(function(result) {
        if(result != null){
          addFeed(result);
          managePagination(result.pagination);
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }

  var addFeed = function(feeds){
    var rw = feeds.data;
    for(var i = 0; i < rw.length; i++){
      var objToAdd = new $model.MyReward(rw[i]);
      $scope.rewards.push(objToAdd);
    }
    if($scope.rewards.length < 1){
      $scope.displayRewardEmpty = true;
    }else{
      $scope.displayRewardEmpty = false;
    }
  };

  $scope.title = "<div class='general-title'>My Rewards</div>";

  $scope.goToShop = function(valid, url){
    if(valid){
      //open in app browser
      window.open(url, '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }
  }

  $scope.copyCode = function(valid, promocode){
    if(valid){
      //copy:
      $cordovaClipboard.copy(promocode).then(function() {
          ionicToast.show('COPIED', 'top', false, 1000);
      }, function() {});
    }
  }

})

.controller('ChangePasswordCtrl', function($scope, $ionicPopup, $ionicPlatform, $helper, AuthService, GENERAL_CONS) {

    $scope.blockDone = false;
    $scope.users = {
      currPassword: '',
      password: '',
      cpassword: ''
    };

    $scope.currLoggedinPassword = "";

    $ionicPlatform.ready(function() {
      //get latest data from server:
      
    });

    $scope.title = "<div class='general-title'>Change Password</div>";

    $scope.doUpdate = function(){
      $scope.blockDone = true;
      if($scope.users.currPassword == "" || $scope.users.password == "" || $scope.users.cpassword == ""){
        $ionicPopup.alert({
           title: 'Change Password',
           subTitle: "All fields can't be empty"
        });
        $scope.blockDone = false;
      }else if(!$helper.isValidPassword($scope.users.password)){
        $ionicPopup.alert({
           title: 'Change Password',
           subTitle: 'Password must contains 8 characters at least 1 Alphabet and 1 Number'
        });
        $scope.blockDone = false
      }else if($scope.users.password != $scope.users.cpassword){
        $ionicPopup.alert({
           title: 'Change Password',
           subTitle: 'Passwords do not match'
        });
        $scope.blockDone = false
      }else{
        var promise = AuthService.changePassword($scope.users.currPassword, $scope.users.password);
        promise.then(function(result) {
          if(result != null){
            if(result.meta.code == "200"){
              //update token
              $localstorage.set(AUTH_EVENTS.CURRTOKEN, result.data.access_token);
            }else{
              $ionicPopup.alert({
                 title: 'Change Password',
                 subTitle: result.meta.message
              });
            }

            $scope.users.currPassword = "";
            $scope.users.password = "";
            $scope.users.cpassword = "";
          }else{
            $ionicPopup.alert({
               title: 'Change Password',
               subTitle: 'Failed to change password'
            });
          }

          $scope.blockDone = false;
        });
      }
    };
})

.controller('SettingCtrl', function($scope, $ionicPopup, $ionicPlatform, $model, $helper, LokiDB, AuthService, GENERAL_CONS) {

    $scope.blockDone = false;
    $scope.notification = {
      n1: false,
      n2: false,
      n3: false,
      n4: false,
      n5: false,
      n6: false
    };

    $scope.currLoggedinPassword = "";

    $ionicPlatform.ready(function() {
      //get latest data from server:
      LokiDB.getSetting().then(function(settingdb){
        if(settingdb == undefined || settingdb.length < 1){
          $helper.showLoader();
          var promise = AuthService.loadMyNotificationSetting();
          promise.then(function(result) {
            if(result != null){
              var settings = result.notificationsettings;
              for(var i = 0; i < settings.length; i++){
                if(settings[i].name == "N1"){
                  $scope.notification.n1 = settings[i].isactive;
                }else if(settings[i].name == "N2"){
                  $scope.notification.n2 = settings[i].isactive;
                }else if(settings[i].name == "N3"){
                  $scope.notification.n3 = settings[i].isactive;
                }else if(settings[i].name == "N4"){
                  $scope.notification.n4 = settings[i].isactive;
                }else if(settings[i].name == "N5"){
                  $scope.notification.n5 = settings[i].isactive;
                }else if(settings[i].name == "N6"){
                  $scope.notification.n6 = settings[i].isactive;
                }

                //add db:
                var setting = new $model.Setting(settings[i].name, settings[i].isactive);
                LokiDB.addSetting(setting);
              }
            }
            $helper.hideLoader();
          });
        }else{
          var settings = settingdb;
          for(var i = 0; i < settings.length; i++){
            if(settings[i].notif == "N1"){
              $scope.notification.n1 = settings[i].isActive;
            }else if(settings[i].notif == "N2"){
              $scope.notification.n2 = settings[i].isActive;
            }else if(settings[i].notif == "N3"){
              $scope.notification.n3 = settings[i].isActive;
            }else if(settings[i].notif == "N4"){
              $scope.notification.n4 = settings[i].isActive;
            }else if(settings[i].notif == "N5"){
              $scope.notification.n5 = settings[i].isActive;
            }else if(settings[i].notif == "N6"){
              $scope.notification.n6 = settings[i].isActive;
            }
          }
        }
      });
    });

    $scope.title = "<div class='general-title'>Notification Settings</div>";

    $scope.changeNotification = function(notif, val){
      $helper.showLoader();
      var promise = AuthService.doUpdateNotificationSetting(notif, val);
      promise.then(function(result) {
        if(result){
          //update db:
          var setting = LokiDB.findSetting(notif);
          if(setting != null && setting != undefined){
            setting.isActive = val;
            LokiDB.updateSetting(setting);
          }
        }
        $helper.hideLoader();
      });
    }
    
});