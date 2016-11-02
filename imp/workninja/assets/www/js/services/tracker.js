'use strict';

// Intercom event tracker

app.factory('Tracker', [
  '$http',
  'CONFIG',
function($http, CONFIG) {

  var Tracker = {
    track: function(event, cb) {
      $http.post(CONFIG.url + '/event', event)
        .success(function(data, status, headers, config) {
          console.log("[Tracker] success: " + JSON.stringify(event));
          if (cb) cb();
        })
        .error(function(data, status, headers, config) {
          console.log("[Tracker] error: " + status);
          if (cb) cb();
        });
    },

    trackLogout: function(cb) {
      Tracker.track({
        event_name: 'logged_off'
      }, cb);
    },

    trackCalledCustomer: function(jobId, cb) {
      Tracker.track({
        event_name: 'called_customer',
        job_id: jobId
      }, cb);
    },

    trackCalledNinja: function(jobId, cb) {
      Tracker.track({
        event_name: 'called_ninja',
        job_id: jobId
      }, cb);
    }
  };

  return Tracker;

}]);
