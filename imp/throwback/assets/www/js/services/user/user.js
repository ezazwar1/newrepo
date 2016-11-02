'use strict';


app.factory('userFactory', function($rootScope, $log, $q, $http, $timeout, authenticationFactory) {

  var userFactory = {};

  userFactory.handleAnalytics = function() {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser.fetch().then(function(user) {
        $rootScope.sessionUser = user;
        updateLastLogin();
        updateTimeZone();
        $rootScope.sessionUser.save();
      });
    }
  }

  function updateLastLogin() {
    if ($rootScope.sessionUser) {
      var currentTime = new Date();
      $rootScope.sessionUser.set('lastLogin', currentTime);
    }
  }

  function updateTimeZone() {
    if ($rootScope.sessionUser) {
      var tz = jstz.determine();
      $rootScope.sessionUser.set('timeZone', tz.name());
    }
  }

  userFactory.updateLastThrowbackCreated = function(emptyFeed) {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser.fetch().then(function(user) {
        if (!$rootScope.sessionUser.get('lastThrowbackCreated')) {
          $rootScope.sessionUser.set('firstTimeEmptyFeed', emptyFeed);
        }
        
        $rootScope.sessionUser.set('lastThrowbackCreated', new Date());
        $rootScope.sessionUser.save();
      });
    }
  }

  userFactory.updateFirstTimeEmptyFeed = function(emptyFeed) {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser.fetch().then(function(user) {
        if (!$rootScope.sessionUser.has('firstTimeEmptyFeed')) {
          console.log('Setting firstTimeEmptyFeed: ' + emptyFeed);
          $rootScope.sessionUser.set('firstTimeEmptyFeed', emptyFeed);
          $rootScope.sessionUser.save();
        }
      });
    }
  }

  userFactory.needToCreateNewThrowback = function() {
    var needToCreateNewThrowbackPromise = $q.defer();

    var watch = $rootScope.$watch(function() {
      return authenticationFactory.isAuthenticated();
    }, function(authenticated) {
      if (authenticated) {
        watch();
        $rootScope.sessionUser.fetch().then(function(result) {
          var lastThrowbackBuffer = 86400 * 10 * 1000; // 10 Days

          var lastThrowbackCreatedDate = $rootScope.sessionUser.get('lastThrowbackCreated');

          var sinceDate = new Date();
          sinceDate.setHours(0, 0, 0, 0);

          if (lastThrowbackCreatedDate) {
            var lastThrowbackCreatedWithBufferDate = new Date(lastThrowbackCreatedDate.getTime() + lastThrowbackBuffer);
            if (lastThrowbackCreatedWithBufferDate < sinceDate) {
              needToCreateNewThrowbackPromise.resolve(true);
            } else {
              needToCreateNewThrowbackPromise.resolve(false);
            }
          } else {
            needToCreateNewThrowbackPromise.resolve(false);
          }
        });
      }
    });

    return needToCreateNewThrowbackPromise.promise;
  }

  userFactory.needToRefreshFeed = function() {
    var needToRefreshFeedPromise = $q.defer();

    var watch = $rootScope.$watch(function() {
      return authenticationFactory.isAuthenticated();
    }, function(authenticated) {
      if (authenticated) {
        watch();

        $rootScope.sessionUser.fetch().then(function(result) {
          var lastThrowbackCreatedDate = $rootScope.sessionUser.get('lastThrowbackCreated');

          var sinceDate = new Date();
          sinceDate.setHours(0, 0, 0, 0);

          if (lastThrowbackCreatedDate) {
            if (lastThrowbackCreatedDate < sinceDate) {
              needToRefreshFeedPromise.resolve(true);
            } else {
              needToRefreshFeedPromise.resolve(false);
            }
          } else {
            needToRefreshFeedPromise.resolve(true);
          }
        });
      }
    });

    return needToRefreshFeedPromise.promise;
  }

  userFactory.areThrowbacksAvailable = function(promise) {
    console.log('Checking if Throwbacks are available');
    var areThrowbacksAvailablePromise = promise;

    if (!areThrowbacksAvailablePromise) {
      areThrowbacksAvailablePromise = $q.defer();
    }

    lastThrowbackCreatedExists().then(function(lastThrowbackCreated) {
      if (lastThrowbackCreated) {
        console.log('Throwbacks are now available');
        areThrowbacksAvailablePromise.resolve(true);
      } else {
        console.log('Throwbacks are not available yet. Sleeping for 1000ms and checking again...');
        $timeout(function() {
          userFactory.areThrowbacksAvailable(areThrowbacksAvailablePromise);
        }, 1000);
      }
    }, function(error) {
      areThrowbacksAvailablePromise.reject(error);
    });

    return areThrowbacksAvailablePromise.promise;
  }

  var lastThrowbackCreatedExists = function() {
    var lastThrowbackCreatedExistsPromise = $q.defer();

    var watch = $rootScope.$watch(function() {
      return authenticationFactory.isAuthenticated();
    }, function(authenticated) {
      if (authenticated) {
        watch();
        $rootScope.sessionUser.fetch().then(function(result) {
          var lastThrowbackCreatedDate = $rootScope.sessionUser.get('lastThrowbackCreated');

          if (lastThrowbackCreatedDate) {
            lastThrowbackCreatedExistsPromise.resolve(true);
          } else {
            lastThrowbackCreatedExistsPromise.resolve(false);
          }
        }, function(error) {
          lastThrowbackCreatedExistsPromise.reject(error);
        });
      }
    });

    return lastThrowbackCreatedExistsPromise.promise;
  }

  userFactory.updateMostRecentTwitterDate = function(twitterDate) {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser.fetch().then(function(user) {
        $rootScope.sessionUser.set('mostRecentTweetDate', twitterDate);
        $rootScope.sessionUser.save();  
      });
    }
  }

  userFactory.updateMostRecentActivity = function(date) {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser.fetch().then(function(user) {
        $rootScope.sessionUser.set('mostRecentTweetDate', twitterDate);
        $rootScope.sessionUser.save().then(function(user) {
          $rootScope.sessionUser = user;
        });
      });
    }
  }

  userFactory.authenticatedWithFacebook = function() {
    var authData = $rootScope.sessionUser.get('authData');
    if (authData) {
      if (Object.keys(authData).indexOf('facebook') > -1) {
        return true;
      }
    }
    return false;
  }

  userFactory.authenticatedWithTwitter = function() {
    var authData = $rootScope.sessionUser.get('authData');
    if (authData) {
      if (Object.keys(authData).indexOf('twitter') > -1) {
        return true;
      }
    }
    return false;
  }
  
  userFactory.authenticatedWithInstagram = function() {
    if ($rootScope.sessionUser.get('instagramAccessToken')) {
      return true;
    }
    return false;
  }

  userFactory.authenticatedWithSoundCloud = function() {
    if ($rootScope.sessionUser.get('soundCloudAccessToken')) {
      return true;
    }
    return false;
  }

  userFactory.subscribeToEmail = function () {
    if ($rootScope.sessionUser) {
      $rootScope.sessionUser.fetch().then(function(user) {
        var params = {
          'userID': user.id
        };
        Parse.Cloud.run('subscribeUserToMailchimp', params, {
          success: function(result) {
            console.log('success: ' + result);
          },
          error: function (error) {
            console.log('error: ' + error);
          }
        });
      });
    } 
  }

  return userFactory;
});
