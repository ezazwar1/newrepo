'use strict';

app.factory('Location', [
  '$rootScope',
  '$window',
  '$http',
  'CONFIG',
  'Session',
function($rootScope, $window, $http, CONFIG, Session) {

  function postLocation(location) {
    $http.post(CONFIG.url + '/location', location)
      .success(function(data, status, headers, config) {
        console.log('[Location] posted');
      })
      .error(function(data, status, headers, config) {
        console.log('[Location] error posting: ' + data + '; status: ' + status);
      });
  }

  // BROWSER BASED LOCATION: for development

  function initBrowserLocation() {
    var watchID = null;
    var options = {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 30000
    };
    var lastLocation = null;

    function success(position) {
      //console.log('[Location] success: ' + position.coords.latitude + ',' + position.coords.longitude + '(acc ' + position.coords.accuracy + ')');
      lastLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      postLocation(lastLocation);
      $rootScope.$broadcast('event:location-changed', lastLocation);
    }

    function failure(error) {
      console.log('[Location] error: ' + error.message + ' (' + error.code + ')');
    }

    function startReporting() {
      console.log('[Location] startReporting');
      if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
      }
      watchID = navigator.geolocation.watchPosition(success, failure, options);

      navigator.geolocation.getCurrentPosition(function(position) {
        console.log('[Location] startReporting: ' + position.coords.latitude + ',' + position.coords.longitude);
        success(position);
      }, function(error) {
        console.log('[Location] startReporting error: ' + error.message + ' (' + error.code + ')');
      }, {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 5000
      });
    }

    function stopReporting() {
      console.log('[Location] stopReporting');
      if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
      }
    }

    function getLastLocation(success, failure) {
      console.log('[Location] getLastLocation');
      if (lastLocation) {
        if (success) success(lastLocation);
      } else {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log('[Location] getLastLocation: ' + position.coords.latitude + ',' + position.coords.longitude);
          lastLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          if (success) success(lastLocation);
        }, function(error) {
          console.log('[Location] getLastLocation error: ' + error.message + ' (' + error.code + ')');
          if (failure) failure(error.message);
        }, {
          enableHighAccuracy: false,
          maximumAge: 30000,
          timeout: 5000
        });
      }
    }

    // stop location reporting on logout
    $rootScope.$on('event:auth-logoutComplete', function() {
      stopReporting();
    });

    return {
      startReporting: startReporting,
      stopReporting: stopReporting,
      getLastLocation: getLastLocation,
      post: postLocation
    }
  }

  // WORKNINJA CORDOVA EXT LOCATION

  function initDeviceLocation() {
    function success(location) {
      if (location && location.latitude !== undefined && location.longitude !== undefined) {
        //console.log('[Location] success: ' + location.latitude + ',' + location.longitude);
        $rootScope.$broadcast('event:location-changed', location);
      }
      $window.cordova.plugins.WorkNinjaExt.locationFinish();
    }

    function failure(error) {
      console.log('[Location] error: ' + error);
      $rootScope.$broadcast('event:location-error', error);
      $window.cordova.plugins.WorkNinjaExt.locationFinish();
    }

    function startReporting() {
      console.log('[Location] startReporting');
      $window.cordova.plugins.WorkNinjaExt.locationStart({
        locationUrl: CONFIG.url + '/location',
        heartbeatUrl: CONFIG.url + '/heartbeat',
        username: Session.currentUser.email,
        token: Session.currentUser.single_access_token,
        batterySavingMode: Session.batterySavingMode
      }, success, failure);
    }

    function stopReporting() {
      console.log('[Location] stopReporting');
      try {
          $window.cordova.plugins.WorkNinjaExt.locationStop();
      } catch (e) {
          console.log('[Location] stopReporting ' + e.message);
      };
      
    };
    
    function finish() {
      console.log('[Location] locationFinish');
      if ($window.cordova) {
        $window.cordova.plugins.WorkNinjaExt.locationFinish();
      }
    }

    function getLastLocation(success, failure) {
      console.log('[Location] getLastLocation');
      $window.cordova.plugins.WorkNinjaExt.getLastLocation(
        success || function() {},
        failure || function() {}
      );
    }

    // stop location reporting on logout
    $rootScope.$on('event:auth-logoutComplete', function() {
      stopReporting();
    });

    return {
      startReporting: startReporting,
      stopReporting: stopReporting,
      getLastLocation: getLastLocation,
      finish: finish,
      post: postLocation
    }
  }

  if ($window.cordova) {
    return initDeviceLocation();
  }
  else {
    return initBrowserLocation();
  }

}]);
