'use strict';

app.factory('ErrorInterceptor', [
  '$rootScope',
  '$q',
function($rootScope, $q) {

  return {
    responseError: function(rejection) {
      //debugger;
      var message = rejection.data ? (rejection.data.info || rejection.data.error) : null;
      var errorInfo = {status: rejection.status, message: message};

      switch (rejection.status) {
        case 0:
          errorInfo.message = errorInfo.message || 'We are having trouble making a connection...';
          $rootScope.$broadcast('error:connection', errorInfo);
          break;
        case 401:
          break;
        case 403:
          errorInfo.message = errorInfo.message || 'Forbidden';
          $rootScope.$broadcast('error:connection', errorInfo);
          break;
        case 404:
          errorInfo.message = errorInfo.message || 'We can\'t process your request right now.  Try again soon';
          $rootScope.$broadcast('error:connection', errorInfo);
          break;
        case 422:
          errorInfo.message = errorInfo.message || 'You\'re data is not quite right.  Check the values you entered and try again';
          $rootScope.$broadcast('error:connection', errorInfo);
          break;
        case 406:
          break;
        default:
          errorInfo.message = errorInfo.message || 'Remote service error';
          $rootScope.$broadcast('error:connection', 'Check you have the right data');
          break;
      }

      return $q.reject(rejection);
    }
  }

}]);
