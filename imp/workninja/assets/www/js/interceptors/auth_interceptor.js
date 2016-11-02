'use strict';

app.factory('AuthInterceptor', [
  'Session',
function(Session) {

  return {
    request: function(config) {
      var currentUser = Session.currentUser;

      // if logged in, set X-Authentication request header
      if (currentUser !== undefined) {
        config.headers['X-Authentication'] = [currentUser.email, currentUser.single_access_token].join(':');
      }
      else {
        delete config.headers['X-Authentication'];
      }

      return config;
    }
  };

}]);
