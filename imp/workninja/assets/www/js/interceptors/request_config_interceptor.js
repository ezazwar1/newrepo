'use strict';

app.factory('RequestConfigInterceptor', [
  '$rootScope',
  'Session',
function($rootScope, Session) {
  return {
    request: function(config) {
      config.headers['Accept'] = 'application/json';
      if ($rootScope.appInfo !== undefined) {
        // pass application info custom header
        config.headers['X-AppInfo'] = $rootScope.appInfo.deviceModel +
        ';' + $rootScope.appInfo.devicePlatform +
        ';' + $rootScope.appInfo.deviceVersion +
        ';' + $rootScope.appInfo.appVersion;
        // pass interesting app settings in custom header
        config.headers['X-AppSettings'] = 'batterySaving=' + Session.batterySavingMode + ';';
      }
      config.timeout = 45000;
      return config;
    }
  };
}]);
