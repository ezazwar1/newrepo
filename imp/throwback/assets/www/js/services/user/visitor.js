'use strict';

app.factory('visitorFactory', function($rootScope, $q, $http, localStorageService, actionFactory) {
  var visitorFactory = {};

  visitorFactory.handleVisitor = function() {
    var handleVisitorPromise = $q.defer();

    var visitorID = localStorageService.get('visitorID');

    if (visitorID) {
      var Visitor = Parse.Object.extend('Visitor');
      var visitorQuery = new Parse.Query(Visitor);
      visitorQuery.equalTo('objectId', visitorID);

      visitorQuery.first({
        success: function(visitor) {
          if (visitor) {
            visitor.set('lastVisitSource', document.referrer);
            visitor.set('lastVisitTime', new Date());
            visitor.set('onMobile', true);
            visitor.set('onWeb', false);

            if (ionic.Platform) {
              if (ionic.Platform.isIOS()) {
                visitor.set('deviceType', 'ios');
              } else if (ionic.Platform.isAndroid()) {
                visitor.set('deviceType', 'android');
              }
            }

            var user = visitor.get('signedUpUser');
            if (!user && $rootScope.sessionUser) visitor.set('signedUpUser', $rootScope.sessionUser);

            visitor.save().then(function(visitor) {
              handleVisitorPromise.resolve(visitor);
            });
          } else {
            createNewVisitor().then(function(visitor) {
              handleVisitorPromise.resolve(visitor);
            });
          }
        }
      });
    } else {
      createNewVisitor().then(function(visitor) {
        handleVisitorPromise.resolve(visitor);
      });
    }

    return handleVisitorPromise.promise;
  }

  visitorFactory.handleVisitorSignUp = function(newUser) {
    var handleVisitorSignUpPromise = $q.defer();

    var visitorID = localStorageService.get('visitorID');

    if (visitorID) {

      var Visitor = Parse.Object.extend('Visitor');
      var visitorQuery = new Parse.Query(Visitor);
      visitorQuery.equalTo('objectId', visitorID);

      visitorQuery.first({
        success: function(visitor) {
          if (visitor) {
            var User = Parse.User;
            var user = new User();
            user.id = newUser.id;

            visitor.set('signedUpUser', user);
            visitor.set('onMobile', true);
            visitor.set('onWeb', false);
            visitor.set('lastVisitTime', new Date());

            visitor.save({
              success: function(result) {
                handleVisitorSignUpPromise.resolve(true);
              },
              error: function(error) {
                console.log(error);
                handleVisitorSignUpPromise.resolve(false);
              }
            });
          } else {
            handleVisitorSignUpPromise.resolve(false);
          }
        }, 
        error: function(error) {
          console.log(error);
          handleVisitorSignUpPromise.resolve(false);
        }
      });

    } else {
      //createNewVisitorWithSignedUpUser(newUser);
      handleVisitorSignUpPromise.resolve(false);
    }

    return handleVisitorSignUpPromise.promise;
  }

  visitorFactory.handlePostShareVisitTracking = function(shareID) {
    var Share = Parse.Object.extend('Share');
    var shareQuery = new Parse.Query(Share);
    shareQuery.equalTo('objectId', shareID);
    shareQuery.first({
      success: function(share) {
        if (share) {
          share.set('sharedSuccessfully', true);
          share.set('numVisits', share.get('numVisits') + 1);
          share.save();
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  visitorFactory.handleAction = function (actionName) {
    var handleActionPromise = $q.defer();

    var visitorID = localStorageService.get('visitorID');

    if (visitorID) {
      var Visitor = Parse.Object.extend('Visitor');
      var visitorQuery = new Parse.Query(Visitor);
      visitorQuery.equalTo('objectId', visitorID);

      visitorQuery.first({
        success: function(visitor) {
          if (visitor) {
            visitorFactory.handleVisitor().then(function(visitor) {
              return actionFactory.handleAction(visitor, actionName);
            }).then(function(action) {
              handleActionPromise.resolve(action);
            });
          } else {
            createNewVisitorAndAction(actionName).then(function(action) {
              handleActionPromise.resolve(action);
            });
          }
        }
      });
    } else {
      createNewVisitorAndAction(actionName).then(function(action) {
        handleActionPromise.resolve(action);
      });    
    }

    return handleActionPromise.promise;
  }

  // function createNewVisitorWithSignedUpUser(newUser) {
  //   var Visitor = Parse.Object.extend('Visitor');
  //   var visitor = new Visitor();

  //   var User = Parse.User;
  //   var user = new User();
  //   user.id = newUser.id;

  //   visitor.set('joinSource', document.referrer);
  //   visitor.set('lastVisitTime', new Date());
  //   visitor.set('signedUpUser', user);
  //   visitor.set('onMobile', true);
  //   visitor.set('onWeb', false);

  //   visitor.save(null, {
  //     success: function(visitor) {
  //       localStorageService.set('visitorID', visitor.id);
  //       localStorageService.cookie.add('visitorID', visitor.id);
  //     }
  //   });
  // }

  function createNewVisitor() {
    var createNewVisitorPromise = $q.defer();

    var Visitor = Parse.Object.extend('Visitor');
    var visitor = new Visitor();

    visitor.set('joinSource', document.referrer);
    visitor.set('lastVisitTime', new Date());
    visitor.set('signedUpUser', $rootScope.sessionUser);
    visitor.set('onMobile', true);
    visitor.set('onWeb', false);

    if (ionic.Platform) {
      if (ionic.Platform.isIOS()) {
        visitor.set('deviceType', 'ios');
      } else if (ionic.Platform.isAndroid()) {
        visitor.set('deviceType', 'android');
      }
    }

    if ($rootScope.sessionUser) {
      visitor.set('signedUpUser', $rootScope.sessionUser);
    }

    visitor.save().then(function(visitor) {
      localStorageService.set('visitorID', visitor.id);
      localStorageService.cookie.add('visitorID', visitor.id);
      createNewVisitorPromise.resolve(visitor);
    });

    return createNewVisitorPromise.promise;
  }

  function createNewVisitorAndAction(actionName) {
    var createNewVisitorAndActionPromise = $q.defer();

    var Visitor = Parse.Object.extend('Visitor');
    var visitor = new Visitor();

    visitor.set('joinSource', document.referrer);
    visitor.set('lastVisitTime', new Date());
    visitor.set('signedUpUser', $rootScope.sessionUser);
    visitor.set('onMobile', true);
    visitor.set('onWeb', false);

    if (ionic.Platform) {
      if (ionic.Platform.isIOS()) {
        visitor.set('deviceType', 'ios');
      } else if (ionic.Platform.isAndroid()) {
        visitor.set('deviceType', 'android');
      }
    }
    
    if ($rootScope.sessionUser) {
      visitor.set('signedUpUser', $rootScope.sessionUser);
    }

    visitor.save().then(function(visitor) {
      localStorageService.set('visitorID', visitor.id);
      localStorageService.cookie.add('visitorID', visitor.id);

      actionFactory.handleAction(visitor, actionName).then(function(action) {
        createNewVisitorAndActionPromise.resolve(action);
      });
    });

    return createNewVisitorAndActionPromise.promise;
  }

  return visitorFactory;
});