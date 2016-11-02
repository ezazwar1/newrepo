angular.module('shared.modalloginsignup', ['ionic', 'user.services'])

.service('ModalCompleteInfoService', function($ionicModal, $rootScope, $http, $q, $ionicModal, $helper, $localstorage, $state, $ionicPopup, TwitterLib, AuthService, AUTH_EVENTS) {

  var init = function($scope, $parentScope, rootmode, rootfullname, rootuserid, rootaccesstoken, rootverified, rootpicture, rootgender, rootusername){
    var promise;
    $mainModalScope = $scope;
    $parentScope = $parentScope;
    $scope = $rootScope.$new();

    $scope.users = {
      email: '',
      mode: rootmode,
      fullname: rootfullname,
      accesstoken: rootaccesstoken,
      verified: rootverified, 
      picture: rootpicture, 
      gender: rootgender, 
      username: rootusername,
      userid: rootuserid
    };

    promise = $ionicModal.fromTemplateUrl('templates/shared/complete-info.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    $scope.doCompleteInfo = function() {
      if(!$helper.isValidEmailAddress($scope.users.email.trim())){
        $ionicPopup.alert({
           title: 'Login failed',
           subTitle: 'You have entered invalid email address',
        });
      }else{
        if($scope.users.mode == "FB"){
          //post FB:
          $helper.showLoader();

          var shopfor = "";
          var styles = "";
          var sizing = "";
          if($mainModalScope.preference != ""){
            shopfor = $mainModalScope.preference.gender;
            if($mainModalScope.preference.style.length > 0){
              styles = $mainModalScope.preference.style;
            }

            if($mainModalScope.preference.sizing.length > 0){
              sizing = $mainModalScope.preference.sizing;
            }
          }

          var promise = AuthService.loginFB($scope.users.email, $scope.users.userid, $scope.users.picture, $scope.users.fullname, $scope.users.gender, $scope.users.verified, $scope.users.accesstoken, shopfor, styles, sizing);
          promise.then(function(result) { 
            $helper.hideLoader();
            if(result){
              $localstorage.set(AUTH_EVENTS.CURRFBID, $scope.users.userid);

              //claimed token:
              if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
                var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
                promise.then(function(result) { 
                });
              }

              $localstorage.set(AUTH_EVENTS.SKIP, 1);

              $scope.modal.hide();
              $scope.closeAllModal();
            }else{
              $ionicPopup.alert({
                 title: 'Login failed',
                 subTitle: 'Failed to retrieve profile, Please try again 1',
              });
            }
          });
        }else{
          //post twitter:
          $helper.showLoader();

          var shopfor = "";
          var styles = "";
          var sizing = "";
          if($mainModalScope.preference != ""){
            shopfor = $mainModalScope.preference.gender;
            if($mainModalScope.preference.style.length > 0){
              styles = $mainModalScope.preference.style;
            }

            if($mainModalScope.preference.sizing.length > 0){
              sizing = $mainModalScope.preference.sizing;
            }
          }

          var promise = AuthService.loginTwitter($scope.users.email, $scope.users.userid, $scope.users.picture, $scope.users.fullname, $scope.users.username, $scope.users.accesstoken, shopfor, styles, sizing);
          promise.then(function(result) { 
            $helper.hideLoader();
            if(result == "OK"){
              $localstorage.set(AUTH_EVENTS.CURRTWITTERID, $scope.users.userid);

              //claimed token:
              if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
                console.log("register token " + $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
                var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
                promise.then(function(result) { 
                });
              }

              $localstorage.set(AUTH_EVENTS.SKIP, 1);

              $scope.modal.hide();
              $scope.closeAllModal();
            }else{
              $helper.hideLoader();
              $ionicPopup.alert({
                 title: 'Login failed',
                 subTitle: 'Failed to retrieve profile, Please try again 2',
              });
            }
          });
        }
      }
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.closeAllModal = function() {
      $scope.modal.hide();
      $mainModalScope.closeModal();
    };

    return promise;
  }

  return {
    init: init
  }
})

.service('ModalLoginSignupService', function($http, $q, $cordovaOauthUtility, $cordovaOauth, $ionicModal, $helper, $localstorage, $rootScope, $state, $ionicPopup, TWITTER_CONFIG, AuthService, AUTH_EVENTS, ModalCompleteInfoService, ModalLoginService, ModalSignupService) {
  
  var init = function($scope, isstep){
    var promise;
    $parentScope = $scope;
    $scope = $rootScope.$new();
    
    promise = $ionicModal.fromTemplateUrl('templates/shared/login-signup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    if($parentScope.preference != undefined){
      $scope.preference = $parentScope.preference;
    }else{
      $scope.preference = "";
    }

    if(isstep != undefined){
      $scope.isStep = isstep;
    }else{
      $scope.isStep = false;
    }

    //user model:
    $scope.users = {
      email: '',
      password: '',
      fullname: ''
    };

    // This method is to get the user profile info from the facebook api
    $scope.getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();
      facebookConnectPlugin.api('/me?fields=email,id,name,gender,verified&access_token=' + authResponse.accessToken, null,
        function (response) {
          info.resolve(response);
        },
        function (response) {
          info.reject(response);
        }
      );
      return info.promise;
    };

    $scope.fbLoginSuccess = function(response){ 
      var authResponse = response.authResponse;
      $scope.getFacebookProfileInfo(authResponse)
      .then(function(profileInfo) {
        var picture = "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large";
        var verified = profileInfo.verified ? 1:0;

        if(profileInfo.email == ""){
          ModalCompleteInfoService
          .init($scope, $parentScope, "FB", profileInfo.name, profileInfo.id, authResponse.accessToken, verified, picture, $helper.convertToBackendGender(profileInfo.gender), "")
          .then(function(modal) {
            $helper.hideLoader();
            modal.show();
          });
        }else{
          var shopfor = "";
          var styles = "";
          var sizing = "";
          if($scope.preference != ""){
            shopfor = $scope.preference.gender;
            if($scope.preference.style.length > 0){
              styles = $scope.preference.style;
            }

            if($scope.preference.sizing.length > 0){
              sizing = $scope.preference.sizing;
            }
          }

          var promise = AuthService.loginFB(profileInfo.email, profileInfo.id, picture, profileInfo.name, $helper.convertToBackendGender(profileInfo.gender), verified, authResponse.accessToken, shopfor, styles, sizing);
          promise.then(function(result) { 
            if(result){
              $localstorage.set(AUTH_EVENTS.CURRFBID, profileInfo.id);
            
              //claimed token:
              if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
                var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
                promise.then(function(result) { 
                });
              }

              $localstorage.set(AUTH_EVENTS.SKIP, 1);

              $helper.hideLoader();
              $scope.closeModal();
            }else{
              $helper.hideLoader();
              $ionicPopup.alert({
                 title: 'Login failed',
                 subTitle: 'Failed to retrieve profile, Please try again',
              });
            }
          });
        }
      }, function(fail){
        // Fail get profile info
        console.log('profile info fail', fail);
        $helper.hideLoader();
        $ionicPopup.alert({
           title: 'Login failed',
           subTitle: 'Failed to get profile from Facebook, Please try again',
        });
      });
    }

    $scope.fbLoginError = function(response){
      $helper.hideLoader();
      $ionicPopup.alert({
         title: 'Login failed',
         subTitle: 'Unable to login to Facebook',
      });
    }

    $scope.loginFB = function() {
      $helper.showLoader();
      facebookConnectPlugin.getLoginStatus(function(success){
        if(success.status === 'connected'){
          //check local storage curen FB ID
          //var user = $localstorage.get(AUTH_EVENTS.CURRFBID);

          $scope.getFacebookProfileInfo(success.authResponse)
          .then(function(profileInfo) {
            var picture = "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large";
            var verified = profileInfo.verified ? 1:0;

            if(profileInfo.email == ""){
              ModalCompleteInfoService
              .init($scope, $parentScope, "FB", profileInfo.name, profileInfo.id, success.authResponse.accessToken, verified, picture, $helper.convertToBackendGender(profileInfo.gender), "")
              .then(function(modal) {
                $helper.hideLoader();
                modal.show();
              });
            }else{
              var shopfor = "";
              var styles = "";
              var sizing = "";
              if($scope.preference != ""){
                shopfor = $scope.preference.gender;
                if($scope.preference.style.length > 0){
                  styles = $scope.preference.style;
                }

                if($scope.preference.sizing.length > 0){
                  sizing = $scope.preference.sizing;
                }
              }

              var promise = AuthService.loginFB(profileInfo.email, profileInfo.id, picture, profileInfo.name, $helper.convertToBackendGender(profileInfo.gender), verified, success.authResponse.accessToken, shopfor, styles, sizing);
              promise.then(function(result) { 
                if(result){
                  $localstorage.set(AUTH_EVENTS.CURRFBID, profileInfo.id);
                  
                  //claimed token:
                  if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
                    var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
                    promise.then(function(result) { 
                    });
                  }

                  $localstorage.set(AUTH_EVENTS.SKIP, 1);

                  $helper.hideLoader();
                  $scope.closeModal();
                }else{
                  $helper.hideLoader();
                  $ionicPopup.alert({
                     title: 'Login failed',
                     subTitle: 'Failed to retrieve profile, Please try again',
                  });
                }
              });
            }
          }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
            $helper.hideLoader();
            $ionicPopup.alert({
               title: 'Login failed',
               subTitle: 'Failed to get profile from Facebook, Please try again',
            });
          });
        }else{
          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], $scope.fbLoginSuccess, $scope.fbLoginError);
        }
      });
    };

    //create twitter signature:
    var createTwitterSignature = function(token, method, url) {
        var oauthObject = {
            oauth_consumer_key: TWITTER_CONFIG.oauthSettings.consumerKey,
            oauth_nonce: $cordovaOauthUtility.createNonce(32),
            oauth_signature_method: "HMAC-SHA1",
            oauth_token: token.oauth_token,
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_version: "1.0",
        };

        var signatureObj = $cordovaOauthUtility.createSignature(method, url,
            oauthObject,{screen_name:token.screen_name}, TWITTER_CONFIG.oauthSettings.consumerSecret, 
            token.oauth_token_secret);

        //$http.defaults.headers.common.Authorization =
        return signatureObj.authorization_header;
    }

    var getTwitterProfile = function(token){
      var deferred = $q.defer();
      var sign = createTwitterSignature(token, 'GET',
             'https://api.twitter.com/1.1/users/show.json');

      $http.get("https://api.twitter.com/1.1/users/show.json",
               {
                params: { screen_name: token.screen_name},
                headers: { 'Authorization': sign }
              })
      .success(function(result) {
                deferred.resolve(result);
      })
     .error(function(error) {
                alert("There was a problem getting your profile");
                deferred.reject(false);
      });
      return deferred.promise;
    }

    //Twitter:
    $scope.loginTwitter = function(){
      $helper.showLoader();
      var callbackURL = 'https://www.getfash.com/oauthcallback.html';
      var options = {
        redirect_uri: callbackURL
      }
      $cordovaOauth.twitter(TWITTER_CONFIG.oauthSettings.consumerKey, TWITTER_CONFIG.oauthSettings.consumerSecret, options).then(function(token) {
        getTwitterProfile(token).then(function(_data) { 
          console.log("Twitter is success");

          var shopfor = "";
          var styles = "";
          var sizing = "";
          if($scope.preference != ""){
            shopfor = $scope.preference.gender;
            if($scope.preference.style.length > 0){
              styles = $scope.preference.style;
            }

            if($scope.preference.sizing.length > 0){
              sizing = $scope.preference.sizing;
            }
          }

          var promise = AuthService.loginTwitter("", _data.id_str, $helper.getNormalTwitterPic(_data.profile_image_url_https), _data.name, _data.screen_name, token.oauth_token, shopfor, styles, sizing);
          promise.then(function(result) { 
            console.log("result twitter" + result);
            if(result == "OK"){
              $localstorage.set(AUTH_EVENTS.CURRTWITTERID, _data.id_str);

              //claimed token:
              if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
                var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
                promise.then(function(result) { 
                });
              }

              $localstorage.set(AUTH_EVENTS.SKIP, 1);

              $helper.hideLoader();
              $scope.closeModal();
            }else if(result == "612"){
              ModalCompleteInfoService
              .init($scope, $parentScope, "TW", _data.name, _data.id_str, token.oauth_token, 0, $helper.getNormalTwitterPic(_data.profile_image_url_https), "", _data.screen_name)
              .then(function(modal) {
                $helper.hideLoader();
                modal.show();
              });
            }else{
              $helper.hideLoader();
              $ionicPopup.alert({
                 title: 'Login failed',
                 subTitle: 'Failed to retrieve profile, Please try again',
              });
            }
            $helper.hideLoader();
          });
        }, function error(_error) {
            console.log(_error);
            $helper.hideLoader();
            console.log("twitter failed");
            $ionicPopup.alert({
               title: 'Login failed',
               subTitle: 'Unable login via twitter',
            });
        });
      }, function(error) {
          // error
          $helper.hideLoader();
          console.log("twitter failed");
          $ionicPopup.alert({
             title: 'Login failed',
             subTitle: 'Unable login via twitter',
          });
      });
    }

    $scope.goToLogin = function(){
      ModalLoginService
      .init($scope, $parentScope)
      .then(function(modal) {
        modal.show();
      });
    };

    $scope.goToSignup = function(){
      ModalSignupService
      .init($scope, $parentScope)
      .then(function(modal) {
        modal.show();
      });
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.backToIntro = function(){
      $scope.modal.hide();
    }

    $scope.closeModal = function() {
      $scope.modal.hide();
      if($parentScope.backToHome || $scope.isStep){
        $state.go('tab.home');
      }
    };

    $scope.goTo = function(url){
      window.open(url, '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    
    return promise;
  }
  
  return {
    init: init
  }
})

.service('ModalLoginService', function($http, $q, $ionicModal, $helper, $localstorage, $rootScope, $state, $ionicPopup, TwitterLib, AuthService, AUTH_EVENTS, ModalCompleteInfoService, ModalResetPasswordService) {
  
  var init = function($scope, $parentScope){
    var promise;
    $mainModalScope = $scope;
    $parentScope = $parentScope;
    $scope = $rootScope.$new();
    
    promise = $ionicModal.fromTemplateUrl('templates/shared/login.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    $scope.displaySignUp = false;
    $scope.displayLogin = true;

    //user model:
    $scope.users = {
      email: '',
      password: '',
      fullname: ''
    };

    $scope.goTo = function(url){
      window.open(url, '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }

    $scope.login = function(){
      var gender = "";
      var stylePreferences = [];
      if($parentScope.preference != null && $parentScope.preference != undefined){
        gender = $parentScope.preference.gender;
        if($parentScope.preference.style.length > 0){
          stylePreferences = $parentScope.preference.style;
        }
      }

      if($scope.users.email.trim() == "" || $scope.users.password == ""){
        $ionicPopup.alert({
           title: 'Login Failed',
           subTitle: 'You have entered invalid email / password',
        });
      }else{
        var gender = "";
        var styles = "";
        var sizing = "";
        if($mainModalScope.preference != ""){
          gender = $mainModalScope.preference.gender;
          if($mainModalScope.preference.style.length > 0){
            styles = $mainModalScope.preference.style;
          }

          if($mainModalScope.preference.sizing.length > 0){
            sizing = $mainModalScope.preference.sizing;
          }
        }

        var promise = AuthService.loginEmail($scope.users.email, $scope.users.password, gender, styles, sizing);
        promise.then(function(result) { 
          if(result){

            //claimed token:
            if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
              var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
              promise.then(function(result) { 
              });
            }

            $localstorage.set(AUTH_EVENTS.SKIP, 1);

            $scope.users.email = "";
            $scope.users.password = "";
            $scope.closeAllModal();
          }else{
            $ionicPopup.alert({
               title: 'Login failed',
               subTitle: 'You have entered invalid email / password!',
            });
          }
        });
      }
    }

    $scope.goToResetPassword = function(){
      ModalResetPasswordService
      .init($scope)
      .then(function(modal) {
        modal.show();
      });
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.closeAllModal = function() {
      $scope.modal.hide();
      $mainModalScope.closeModal();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    
    return promise;
  }
  
  return {
    init: init
  }
})

.service('ModalSignupService', function($http, $q, $ionicModal, $helper, $localstorage, $rootScope, $state, $ionicPopup, TwitterLib, AuthService, AUTH_EVENTS, ModalCompleteInfoService) {
  
  var init = function($scope, $parentScope){
    var promise;
    $mainModalScope = $scope;
    $parentScope = $parentScope;
    $scope = $rootScope.$new();
    
    promise = $ionicModal.fromTemplateUrl('templates/shared/signup.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    //user model:
    $scope.users = {
      email: '',
      password: '',
      fullname: ''
    };

    $scope.goTo = function(url){
      window.open(url, '_system', 'closebuttoncaption=Done,toolbarposition=top');
    }

    $scope.signUp = function(){
      if($scope.users.email.trim() == "" || $scope.users.password == "" || $scope.users.fullname.trim() == ""){
        $ionicPopup.alert({
           title: 'Sign up',
           subTitle: 'Email, password and fullname are required for registration',
        });
      }else if(!$helper.isValidEmailAddress($scope.users.email.trim())){
        $ionicPopup.alert({
           title: 'Sign up failed',
           subTitle: 'You have entered Invalid email address format',
        });
      }else if(!$helper.isValidPassword($scope.users.password.trim())){
        $ionicPopup.alert({
           title: 'Sign up failed',
           subTitle: 'Password must contains 8 characters at least 1 Alphabet and 1 Number',
        });
      }else{
        var gender = "";
        var styles = "";
        var sizing = "";
        if($mainModalScope.preference != ""){
          gender = $mainModalScope.preference.gender;
          if($mainModalScope.preference.style.length > 0){
            styles = $mainModalScope.preference.style;
          }

          if($mainModalScope.preference.sizing.length > 0){
            sizing = $mainModalScope.preference.sizing;
          }
        }

        var promise = AuthService.signupEmail($scope.users.email, $scope.users.password, $scope.users.fullname, gender, styles, sizing);
        promise.then(function(result) { 
          if(result == ""){

            //claimed token:
            if($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != null && $localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID) != undefined){
              var promise = AuthService.doClaimToken($localstorage.get(AUTH_EVENTS.ANDROIDDEVICEID));
              promise.then(function(result) { 
              });
            }

            $localstorage.set(AUTH_EVENTS.SKIP, 1);

            $scope.users.email = "";
            $scope.users.password = "";
            $scope.users.fullname = "";
            $scope.closeAllModal();
          }else{
            $ionicPopup.alert({
               title: 'Sign up',
               subTitle: result,
            });
          }
        });
      }
    }

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.closeAllModal = function() {
      $scope.modal.hide();
      $mainModalScope.closeModal();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    
    return promise;
  }
  
  return {
    init: init
  }
})

.service('ModalResetPasswordService', function($http, $q, $ionicModal, $helper, $localstorage, $rootScope, $state, $ionicPopup, TwitterLib, AuthService, AUTH_EVENTS) {
  
  var init = function($scope){
    var promise;
    $parentScope = $scope;
    $scope = $rootScope.$new();
    
    promise = $ionicModal.fromTemplateUrl('templates/shared/resetpassword.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modal = modal;
      return modal;
    });

    //user model:
    $scope.users = {
      email: ''
    };

    $scope.resetPassword = function(){
      if($scope.users.email.trim() == ""){
        $ionicPopup.alert({
           title: 'Reset Password',
           subTitle: 'Email is required for reset password',
        });
      }else{
        var promise = AuthService.doResetPassword($scope.users.email);
        promise.then(function(result) { 
          if(result){
            $ionicPopup.alert({
               title: 'Reset Password',
               subTitle: "Reset password instruction has been sent to your registered email address",
            });
            $scope.users.email = "";
          }else{
            $ionicPopup.alert({
               title: 'Reset Password',
               subTitle: "Unable to reset your password",
            });
          }
        });
      }
    }

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    
    return promise;
  }
  
  return {
    init: init
  }
});