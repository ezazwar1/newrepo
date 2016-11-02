cordova.define("com.workninja.cordova.WorkNinjaExt", function(require, exports, module) { var exec = require("cordova/exec");

module.exports = {
  // configure: function(config, success, failure) {
  //   // Geolocation
  //   config.desiredAccuracy     = config.desiredAccuracy >= 0 ? config.desiredAccuracy : 10;     // meters
  //   config.distanceFilter      = config.distanceFilter >= 0 ? config.distanceFilter : 30;       // meters
  //   config.stationaryRadius    = config.stationaryRadius >= 0 ? config.stationaryRadius : 30;    // meters
  //   config.locationTimeout     = config.locationTimeout >= 0 ? config.locationTimeout : 60;      // seconds
  //   config.activityType        = config.activityType ||  "Fitness";
  //   config.debug               = config.debug || false;
  //   config.notificationTitle   = config.notificationTitle || "WorkNinja";
  //   config.notificationText    = config.notificationText || "ENABLED";
  //   // PubNub
  //   config.publishKey          = config.publishKey || '';
  //   config.subscribeKey        = config.subscribeKey || '';
  //   config.secretKey           = config.secretKey || '';

  //   exec(
  //     success || function() {},
  //     failure || function() {},
  //     'WorkNinjaExt',
  //     'configure',
  //     [config]
  //   );
  // },

  openSettings: function(success, failure) {
    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'openSettings',
      []);
  },

  // Geolocation
  locationManagerRegister: function(success, failure) {
    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'locationManagerRegister',
      []);
  },
  locationStart: function(options, success, failure) {
    options.locationUrl = options.locationUrl || '';
    options.heartbeatUrl = options.heartbeatUrl || '';
    options.username = options.username || '';
    options.token = options.token || '';

    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'locationStart',
      [options]
    );
  },
  locationStop: function(success, failure) {
    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'locationStop',
      []);
  },
  locationFinish: function(success, failure) {
    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'locationFinish',
      []);
  },
  getLastLocation: function(success, failure) {
    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'getLastLocation',
      []);
  },

  // PubNub
  registerRemoteNotifications: function(success, failure) {
      exec(
        success || function() {},
        failure || function() {},
        'WorkNinjaExt',
        'registerRemoteNotifications',
        []);
  },
  enableRemoteNotifications: function(options, success, failure) {
    options.channel = options.channel || '';

    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'enableRemoteNotifications',
      [options]
    );
  },
  disableRemoteNotifications: function(options, success, failure) {
    options.channel = options.channel || '';

    exec(
      success || function() {},
      failure || function() {},
      'WorkNinjaExt',
      'disableRemoteNotifications',
      [options]
    );
  }
};

});
