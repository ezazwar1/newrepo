'use strict';

MyApp.factory('UserService', function UserService ($q, $rootScope, $cordovaFile, $http, $window, localStorageService, $ionicLoading, $timeout, _) {

  var userServiceFactory = {},
      _tmpPartnerData,
      _tmpUserName = "",
      _tmpPhoneNumber = "",
      _tmpCountryCode = "";

  function _setUserNameTmp(aUserName) {
    _tmpUserName = aUserName;
  };

  function _getUserNameTmp() {
    return _tmpUserName;
  };

  function _setPhoneNumberTmp(pNumber) {
    _tmpPhoneNumber = pNumber;
  }

  function _getPhoneNumberTmp() {
    return _tmpPhoneNumber;
  }

  function _setCountryCodeTmp(tCountryCode) {
    _tmpCountryCode = tCountryCode;
  }

  function _getCountryCodeTmp() {
    return _tmpCountryCode;
  }

  var _saveDevice = function(signupData, deviceId) {
    var deferred = $q.defer(),
        data = {
          mobilenumber:signupData.countryCode + signupData.phone,
          device_id: deviceId
        };
    $http.post($rootScope.urlBackend + '/user/device', data).success(function(response) {
      deferred.resolve(response);
    }).error(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var _signUpUser = function (signupData) {

  		var deferred = $q.defer();
        var data = {
          username:signupData.username,
          profilename:signupData.profilename,
          mobilenumber: signupData.countryCode + signupData.phone,
          country: signupData.country,
          password:"demo"
        };

        if (signupData.image) {
          data.image = signupData.image;
        }

        $http.post($rootScope.urlBackend + '/v2' + '/users', data).success(function (response) {
          if(response.user){
              _setAuthData({
                  id: response.user._id,
                  username: response.user.username,
                  profilename: response.user.profilename,
                  mobilenumber: response.user.mobilenumber,
                  isAuth:false
              });
          }
          deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
	};

  var _getMobileNumber = function () {
    var authData = _getAuthData();
    return authData.mobilenumber;
  };

  var _getAuthData = function () {
    if ($rootScope.authData) {
      return $rootScope.authData;
    } else if (0) {
      // leave if for some period
      console.warn('AUTH FROM LOCAL STORAGE');
      return localStorageService.get('authorizationData');
    }
    return $rootScope.authData;
  };

  var _restoreAuth = function () {

    var deferred = $q.defer(), parsedData;

    if ($rootScope.authData) {
      deferred.resolve($rootScope.authData);
    }

    $cordovaFile.readAsText('.triby_auth_test.json').then(function (response) {
        try {
          parsedData = JSON.parse(response);
          //delete parsedData.id;
          $rootScope.authData = parsedData;

          console.log('auth restored', $rootScope.authData);
          deferred.resolve($rootScope.authData);
        } catch(err) {
          deferred.reject(err);
        }
      },
      function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  };

  var _confirmUser = function (data, aCode) {

      var deferred = $q.defer();
      _.extend(data, {
        code: aCode
      });

      $http.post($rootScope.urlBackend + '/user/confirm', data).success(function (response) {

        $rootScope.debugInfo({"m":'conf2',"d": response});
        deferred.resolve(response);
      }).error(function (err, status) {

        $rootScope.debugInfo({"m":'conf-err',"d": err});
          deferred.reject(err);
      });

      return deferred.promise;
  };

  var _isAuthorized = function () {
    var authData = _getAuthData();
    if(!authData || !authData.id)
      return false;
    else
      return authData.isAuth;
  };

  var _loginUser = function () {
    var deferred = $q.defer();
    var authData = _getAuthData();
    var data = {
      username: authData.username,
      mobilenumber: authData.mobilenumber
    };

    $http.post($rootScope.urlBackend + '/v2/users/login', data).success(function (response) {
      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(status);
    });

    return deferred.promise;
  };

  var _getUser = function(aUserName, type){
    var authData = _getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    if (!aUserName) aUserName = authData.mobilenumber;
    if (!type) type = 'mobilenumber';

    return $http.get($rootScope.urlBackend + '/user/' + aUserName, {
      params: {
        type: type
      }
    });
  };

  var _setPartnerData = function(partnerData) {
    _tmpPartnerData = null;
    _tmpPartnerData = partnerData;
  };

  var _getPartnerData = function() {
    return _tmpPartnerData;
  };

  var _setAuthData = function (userData) {
    var currentData = _getAuthData();
    var newData = {};

    //'id'  does not write
    _.each(['id', 'username', 'profilename', 'mobilenumber', 'token', 'isAuth', 'type', 'country', 'pic'], function (parameter, index, list) {
      if (userData && !_.isUndefined(userData[parameter])) {
        newData[parameter] = userData[parameter];
      } else if (currentData && !_.isUndefined(currentData[parameter])) {
        newData[parameter] = currentData[parameter];
      }
    });

    if (window.cordova && newData.id) {
      $window.analytics.setUserId(newData.id);
    }

    $cordovaFile.writeFile('.triby_auth_test.json', JSON.stringify(newData)).then(function (response) {
        console.log('auth saved: ', response);
      },
      function (error) {
        console.error('error on auth save: ', error);
      });
    //if (userData.id) newData.id = userData.id;
    $rootScope.authData = newData;
    // leave if for some period
    //localStorageService.set('authorizationData', newData);
  };

  var _searchByProfileName = function(profileName, tribeMembers) {
//    alert('_searchByProfileName');
//    console.log('profileName', profileName);
//    console.log('tribeMembers', tribeMembers);
    var authData = _getAuthData();
    $http.defaults.headers.common['Authorization'] = authData.token;

    var data = {
      profileName: profileName,
      tribeMembers: tribeMembers
    };

    return $http.post($rootScope.urlBackend + '/v2/users/search', data);
  };

  var _restoreLastScreen = function() {
    var savedLastUrl = localStorage.getItem('lastUrl') || 'chat',
      settingsPatterns = ['settings', 'profile', 'notifications', 'feedback', 'terms'],
      contactsPatterns = ['contacts_page'],
      chatPatterns = ['chat'],
      groupsPatterns = ['main', 'news_feed', 'mural', 'app/info', 'app/edit_info', 'comments', 'search'],
      path;

    if( new RegExp(contactsPatterns[0]).test(savedLastUrl) ) {
      path = '#/app/contacts_page';
    }
    else if( new RegExp(groupsPatterns[0]).test(savedLastUrl) ||
             new RegExp(groupsPatterns[1]).test(savedLastUrl) ||
             new RegExp(groupsPatterns[2]).test(savedLastUrl) ||
             new RegExp(groupsPatterns[3]).test(savedLastUrl) ||
             new RegExp(groupsPatterns[4]).test(savedLastUrl) ||
             new RegExp(groupsPatterns[5]).test(savedLastUrl) ||
             new RegExp(groupsPatterns[6]).test(savedLastUrl)) {
      path = '#/app/main/home';
    }
    else if( new RegExp(settingsPatterns[0]).test(savedLastUrl) ||
             new RegExp(settingsPatterns[1]).test(savedLastUrl) ||
             new RegExp(settingsPatterns[2]).test(savedLastUrl) ||
             new RegExp(settingsPatterns[3]).test(savedLastUrl) ||
             new RegExp(settingsPatterns[4]).test(savedLastUrl)) {
      path = '#/app/settings/';
    }
    else {
      path = '#/app/chats';
    }

    location.replace(path);

    $timeout(function() {
      $ionicLoading.hide();
    }, 20);
  };

  var _setLastScreen = function(url) {
    localStorage.setItem('lastUrl', url);
  };

  _.extend(userServiceFactory, {
    saveDevice: _saveDevice,
    signUpUser: _signUpUser,
    getMobileNumber: _getMobileNumber,
    getAuthData: _getAuthData,
    confirmUser: _confirmUser,
    isAuthorized: _isAuthorized,
    loginUser: _loginUser,
    getUser: _getUser,
    getUserNameTmp: _getUserNameTmp,
    setUserNameTmp: _setUserNameTmp,
    getPhoneNumberTmp:_getPhoneNumberTmp,
    setPhoneNumberTmp: _setPhoneNumberTmp,
    getCountryCodeTmp:_getCountryCodeTmp,
    setCountryCodeTmp:_setCountryCodeTmp,
    setAuthData: _setAuthData,
    setPartnerData: _setPartnerData,
    getPartnerData: _getPartnerData,
    restoreAuth: _restoreAuth,
    restoreLastScreen: _restoreLastScreen,
    setLastScreen: _setLastScreen,
    searchByProfileName: _searchByProfileName
  });

  return userServiceFactory;
});
