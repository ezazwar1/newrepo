'use strict'

app.factory('networkFactory', function() {
  var networkFactory = {};

  networkFactory.isNetworkOffline = function() {
    if (ionic.Platform.isIOS()) {
      // we don't have network-information installed on our released build so use navigator.onLine
      if (!navigator.onLine) {
        return true;
      }
      return false;
    } else if (ionic.Platform.isAndroid()) {
      return false;
    }

    return false;
  }

  return networkFactory;
});