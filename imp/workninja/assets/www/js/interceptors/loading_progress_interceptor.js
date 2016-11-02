'use strict';

app.factory('LoadingProgressInterceptor', [
  '$rootScope',
  '$q',
function($rootScope, $q) {

  return {
    request: function(config) {
      if (config && config.method == 'POST' && _(config.url).endsWith('location')) {
        // do not show loading indicator for location updates
        return config || $q.when(config);
      }
      $rootScope.$broadcast('event:loadingStarted');
      return config || $q.when(config);
    },
    requestError: function(rejection) {
      $rootScope.$broadcast('event:loadingFinished');
      return $q.reject(rejection);
    },
    response: function(response) {
      $rootScope.$broadcast('event:loadingFinished');
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      $rootScope.$broadcast('event:loadingFinished');
      return $q.reject(rejection);
    }
  };

}]);
