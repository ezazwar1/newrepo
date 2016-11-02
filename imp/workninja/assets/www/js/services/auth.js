'use strict';

app.factory('Auth', [
  '$rootScope',
  '$http',
  'authService',
  'httpBuffer',
  'CONFIG',
  'Session',
function($rootScope, $http, authService, httpBuffer, CONFIG, Session) {

  return {
    login: function(user) {
      $http.post(CONFIG.url + '/auth', 
        user
      , {
        ignoreAuthModule: true
      })
      .success(function (data, status, headers, config) {
        // save current user
        Session.currentUser = data;
        // let authService know that login succeeded, but reject all pending reqs
        httpBuffer.rejectAll();
        authService.loginConfirmed(data);
      })
      .error(function (data, status, headers, config) {
        console.log("Login failed, status: " + status);
        $rootScope.$broadcast('event:auth-loginFailed', status);
      });
    },

    logout: function() {
      $rootScope.$broadcast('event:auth-logoutComplete');
      Session.currentUser = null;
    }
  };

}]);
