
app.factory('authenticationFactory', function($rootScope, $http, $state, $q, $ionicLoading, facebook, visitorFactory, configuration) {
  var authenticationFactory = {};
  authenticationFactory.handleFacebookAuth = function() {
    var handleFacebookAuthPromise = $q.defer();

    var permissions = ['email', 'public_profile', 'user_friends', 'read_stream', 'user_photos'];

    facebook.login(permissions,
      function(result) {
        console.log(result);

        handleParseAuth(result['authResponse']['userID'], 
                        result['authResponse']['accessToken'], 
                        result['authResponse']['expirationDate'],
                        result['authResponse']['expiresIn']).then(function(result) {
                          handleFacebookAuthPromise.resolve(result);
                        }, function(error) {
                          handleFacebookAuthPromise.reject(error);
                        });
      },
      function(error) {
        console.log(error);
        handleFacebookAuthPromise.reject("permissions_error");
      }
    );

    return handleFacebookAuthPromise.promise;
  }

  var handleParseAuth = function(userID, access_token, expiration_date, expires_in) {
    var handleParseAuthPromise = $q.defer();

    if (typeof expiration_date == 'undefined') {
      var expirationEpochTime = (new Date).getTime() + expires_in * 1000;
      var expiration_date = (new Date(expirationEpochTime)).toISOString();
    }

    $http({
      method:'POST',
      url:'https://api.parse.com/1/users',
      data:{
        'authData': {
          'facebook': {
            'id':userID,
            'access_token':access_token,
            'expiration_date':expiration_date
          }
        }
      },
      headers:{
        'X-Parse-Application-Id': $rootScope.parseApplicationID,
        'X-Parse-REST-API-Key': $rootScope.parseRESTAPIKey,
        'Content-Type':'application/json'
      }
    }).
      success(function(data, status, headers, config) {
        var session_token = data['sessionToken'];
        Parse.User.become(session_token).then(
          function(user) {
            console.log(user);

            parseFeedForUser(user.id, access_token);

            $rootScope.sessionUser = user;

            if (status == 200) {
              $rootScope.sessionUser = user;
              $rootScope.sessionUser.set('lastLogin', new Date());
              $rootScope.sessionUser.save();
              handleParseAuthPromise.resolve(200);
            } else {
              $rootScope.sessionUser = user;
              var currentUser =  $rootScope.sessionUser;
              facebook.api('/me', []).then(
                function (response) {
                  console.log(response);
                  if (response && !response.error) {
                    
                    var name = response['name'];
                    var facebookID = parseInt(response['id']);
                    var email = response['email'];

                    facebook.api('/me?fields=picture&type=square', []).then(function(response) {
                      var profilePictureURL = response['picture']['data']['url'];
                      currentUser.set('profilePictureURL', profilePictureURL);
                      currentUser.setEmail(email);
                      currentUser.set('fullName', name);
                      currentUser.set('facebookID', facebookID);
                      currentUser.set('lastLogin', new Date());

                      var tz = jstz.determine();
                      currentUser.set('timeZone', tz.name());

                      return currentUser.save();
                    }).then(function(response) {
                      return visitorFactory.handleVisitorSignUp(currentUser);
                    }).then(function(response) {
                      subscribeEmailForUser($rootScope.sessionUser.id);
                      //addFriendsOnFacebook();
                      handleParseAuthPromise.resolve(201);
                    }).catch(function(error) {
                      console.log(error);
                      handleParseAuthPromise.reject(error);
                    });
                  } else {
                    handleParseAuthPromise.reject(response.error);
                  }
                });
            }
          },
          function(error) {
            handleParseAuthPromise.reject(error);
            console.log(error);
          });
      }).
      error(function(data, status, headers, config) {
        console.log(data);
        handleParseAuthPromise.reject(data);
      });
      return handleParseAuthPromise.promise;
  }

  var parseFeedForUser = function(user_id, access_token) {
    $http({
      method:'GET',
      url: configuration.apiBaseURL + 'parse/facebook' + '?user_id=' + user_id
                                                        + '&fb_session_token=' + access_token
    }).
    success(function(data, status, headers, config) {
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });
  }

  var subscribeEmailForUser = function(user_id) {
    $http({
      method:'POST',
      url: configuration.apiBaseURL + 'email/add' + '?user_id=' + user_id
    }).
    success(function(data, status, headers, config) {
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });
  }

  function addFriendsOnFacebook() {
    console.log('adding current users friends on facebook');

    // initialize promise
    var addFriendsPromise = $q.defer();

    // get current user and get the objectId
    var currentUser = $rootScope.sessionUser;
    var currentUserID = currentUser.id;

    // construct params
    var params = {
      'userID': currentUserID,
    }

    Parse.Cloud.run('addFriendsOnFacebook', params, {
      success: function(result) {
        console.log('friends successfully added for this facebook user');
        addFriendsPromise.resolve(true);
      },
      error: function (error) {
        console.log(error);
      }
    });

    return addFriendsPromise.promise;
  }

  authenticationFactory.handleAddFacebookPermissions = function(permission) {
    var handleAddFacebookPermissionsPromise = $q.defer();

    var permissions = [];
    permissions.push(permission);

    facebook.login(permissions,
      function(result) {
        var userID = result['authResponse']['userID'];
        var access_token = result['authResponse']['accessToken'];
        var expiration_date = result['authResponse']['expirationDate'];
        var expires_in = result['authResponse']['expiresIn'];

        if (typeof expiration_date == 'undefined') {
          var expirationEpochTime = (new Date).getTime() + expires_in * 1000;
          var expiration_date = (new Date(expirationEpochTime)).toISOString();
        }

        console.log('new access token: ' + access_token);

        // Check if user allowed permission
        authenticationFactory.getFacebookPermissions().then(function(permissions) {
          if (permissions['publish_actions']) {
            console.log('publish_actions granted!');
            $http({
              method:'POST',
              url:'https://api.parse.com/1/users',
              data:{
                'authData': {
                  'facebook': {
                    'id':userID,
                    'access_token':access_token,
                    'expiration_date':expiration_date
                  }
                }
              },
              headers:{
                'X-Parse-Application-Id': $rootScope.parseApplicationID,
                'X-Parse-REST-API-Key': $rootScope.parseRESTAPIKey,
                'Content-Type':'application/json'
              }
            }).
              success(function(data, status, headers, config) {
                var session_token = data['sessionToken'];
                Parse.User.become(session_token).then(
                  function(user) {
                    $rootScope.sessionUser = user;

                    if (status == 200) {
                      $rootScope.sessionUser = user;
                      $rootScope.sessionUser.set('lastLogin', new Date());
                      $rootScope.sessionUser.save();
                      console.log('access token: ' + user.get('authData')['facebook']['access_token']);
                      handleAddFacebookPermissionsPromise.resolve(user.get('authData')['facebook']['access_token']);
                    } else {
                      handleAddFacebookPermissionsPromise.reject("user does not exist error");
                    }
                  },
                  function(error) {
                    console.log(error);
                    handleAddFacebookPermissionsPromise.reject(error);
                  });
              }).
              error(function(data, status, headers, config) {
                console.log(data);
                handleAddFacebookPermissionsPromise.reject("parse error");
              });
          } else {
            console.log("publish_actions wasn't granted!");
            handleAddFacebookPermissionsPromise.reject("permissions_error");
          }
        },
        function(error) {
          handleAddFacebookPermissionsPromise.reject(error);
        });
      },
      function(error) {
        console.log(error);
        handleAddFacebookPermissionsPromise.reject("permissions_error");
      }
    );

    return handleAddFacebookPermissionsPromise.promise;
  }

  authenticationFactory.handleTwitterAuth = function() {
    var handleTwitterAuthPromise = $q.defer();

    OAuth.popup('twitter', {'cache':true}).
      done(function(result) {
        $ionicLoading.show({
          template: 'Contacting Throwback...'
        });

        result.get('1.1/account/verify_credentials.json').done(function(twitterUserObject) {
          $http({
            method:'PUT',
            url:'https://api.parse.com/1/users/' + $rootScope.sessionUser.id,
            data:{
              'authData': {
                'twitter': {
                  'id':twitterUserObject['id_str'],
                  'screen_name':twitterUserObject['screen_name'],
                  'consumer_key':$rootScope.twitterConsumerKey,
                  'consumer_secret':$rootScope.twitterSecret,
                  'auth_token':result['oauth_token'],
                  'auth_token_secret':result['oauth_token_secret'],
                }
              }
            },
            headers:{
              'X-Parse-Application-Id':$rootScope.parseApplicationID,
              'X-Parse-REST-API-Key':$rootScope.parseRESTAPIKey,
              'X-Parse-Session-Token':$rootScope.sessionUser.getSessionToken(),
              'Content-Type':'application/json'
            }
          }).
          success(function(data, status, headers, config) {
            var currentUser = $rootScope.sessionUser;

            currentUser.fetch(function(refreshedCurrentUser) {
              refreshedCurrentUser.set('twitterID', twitterUserObject['id']);
              refreshedCurrentUser.set('lastThrowbackCreated', null);
              return refreshedCurrentUser.save();
            }).then(function(user) {
                // addFriendsOnTwitter();
                $rootScope.sessionUser = user;
                handleTwitterAuthPromise.resolve(result);
            });
          }).
          error(function(data, status, headers, config) {
            console.log(data);
          });
      }).
      fail(function(error) {
        console.log('user canceled twitter');
        console.log(error);
        handleTwitterAuthPromise.reject(error);
      });
    });
    return handleTwitterAuthPromise.promise;
  }

  function addFriendsOnTwitter() {
    console.log('adding current users friends on twitter');

    // initialize promise
    var addFriendsPromise = $q.defer();

    // get current user and get the objectId
    var currentUser = $rootScope.sessionUser;
    var currentUserID = currentUser.id;

    // construct params
    var params = {
      'userID': currentUserID,
    }

    Parse.Cloud.run('addFriendsOnTwitter', params, {
      success: function(result) {
        console.log('friends successfully added for this Twitter user');
        addFriendsPromise.resolve(true);
      },
      error: function (error) {
        console.log(error);
      }
    });

    return addFriendsPromise.promise;
  };

  authenticationFactory.handleInstagramAuth = function() {
    var handleInstgramAuthPromise = $q.defer();

    OAuth.popup('instagram', {'cache':true}).
      done(function(result) {
        var currentUser = $rootScope.sessionUser;

        currentUser.set('instagramAccessToken', result['access_token']);
        currentUser.set('lastThrowbackCreated', null);
        currentUser.save().then(function(user) {
          $rootScope.sessionUser = user;
          handleInstgramAuthPromise.resolve(result);
        });
      }).
      fail(function(error) {
        console.log(error);
        handleInstgramAuthPromise.reject(error);
      });

    return handleInstgramAuthPromise.promise;
  }

  authenticationFactory.isAuthenticated = function() {
    if (!$rootScope.sessionUser) {
      return false;
    }
    return true;
  }

  authenticationFactory.isAuthenticatedOnParse = function() {
    var isAuthenticatedOnParsePromise = $q.defer();
    var userQuery = new Parse.Query('User');

    userQuery.get($rootScope.sessionUser.id, {
      success: function(object) {
        if (object) {
          isAuthenticatedOnParsePromise.resolve(true);
        } else {
          isAuthenticatedOnParsePromise.resolve(false);
        }
      },
      error: function(object, error) {
        if (error.code == 101) {
          isAuthenticatedOnParsePromise.resolve(false);
        } else {
          isAuthenticatedOnParsePromise.resolve(true);
        }
      }
    });

    return isAuthenticatedOnParsePromise.promise;
  }

  authenticationFactory.authenticatedWithTwitter = function() {
    var authData = $rootScope.sessionUser.get('authData');
    if (authData) {
      if (Object.keys(authData).indexOf('twitter') > -1) {
        return true;
      }
    }
    return false;
  }
  
  authenticationFactory.authenticatedWithInstagram = function() {
    if ($rootScope.sessionUser.get('instagramAccessToken')) {
      return true;
    }
    return false;
  }

  authenticationFactory.handleLogOut = function() {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser = false;
      Parse.User.logOut();
    }
    $state.go('opening');
  }

  authenticationFactory.getFacebookSessionToken = function() {
    var getFacebookSessionTokenPromise = $q.defer();

    var authData = $rootScope.sessionUser.get('authData');

    if (authData) {
      if (Object.keys(authData).indexOf('facebook') > -1) {
        getFacebookSessionTokenPromise.resolve(authData['facebook']['access_token']);
      } else {
        getFacebookSessionTokenPromise.reject('Current user does not have a Facebook session token');
      }
    } else {
      visitorFactory.handleAction("feed_share_fetching_fb_session_token");
      var currentUser = $rootScope.sessionUser;

      currentUser.fetch().then(function(user) {
        $rootScope.sessionUser = user;
        if (Object.keys($rootScope.sessionUser.get('authData')).indexOf('facebook') > -1) {
          getFacebookSessionTokenPromise.resolve(authData['facebook']['access_token']);
        } else {
          getFacebookSessionTokenPromise.reject('Current user does not have a Facebook session token');
        }
      },
      function(error) {
        getFacebookSessionTokenPromise.reject(error);
      });
    }

    return getFacebookSessionTokenPromise.promise;
  }

  authenticationFactory.getFacebookPermissions = function() {
    var getFacebookPermissionsPromise = $q.defer();
    authenticationFactory.getFacebookSessionToken().then(function(facebook_session_token) {
      if (facebook_session_token) {
        var permissions_request_url = 'https://graph.facebook.com/me/permissions?access_token=' + facebook_session_token;

        $http.get(permissions_request_url).
        success(function(response) {
          var response_data = response['data'];

          if (response_data) {
            var permissions = response_data[0];
            if (permissions) {
              getFacebookPermissionsPromise.resolve(permissions);
            } else {
              getFacebookPermissionsPromise.reject('No permissions array found');
            }
          } else {
            getFacebookPermissionsPromise.reject('No data in response');
          }
        }).
        error(function(response) {
          getFacebookPermissionsPromise.reject(response);
        });
      } else {
        getFacebookPermissionsPromise.reject('No Facebook Session Token Found');
      }
    },
    function(error) {
      getFacebookPermissionsPromise.reject(error);
    });

    return getFacebookPermissionsPromise.promise;
  }

  authenticationFactory.completedOnboarding = function() {
    var currentUser = $rootScope.sessionUser;
    if (currentUser.get('onMobile') == true) {
      return true;
    }
    return false;
  }

  authenticationFactory.setOnMobile = function() {
    var currentUser = $rootScope.sessionUser;
    currentUser.fetch().then(function(user) {
      $rootScope.sessionUser = user;
      user.set('onMobile', true);
      user.save();
    });
  }

  return authenticationFactory;
});