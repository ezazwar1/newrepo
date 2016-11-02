'use strict';

MyApp.factory('lowInternetService', ['LOW_INTERNET_TIMEOUT', '$injector', function(LOW_INTERNET_TIMEOUT, $injector) {
  var listeners = {},
    isPopupShowed = false,
    infoPopup,
    currentPopupRequestId;

  function addListener(name) {
    listeners[name] = setTimeout(function (n) {
      showInfoPopup(n);
    }, LOW_INTERNET_TIMEOUT, name);
  }

  function removeListener(name) {
    clearTimeout(listeners[name]);
    delete listeners[name];

    if(currentPopupRequestId === name) {
      hidePopup();
    }
  }

  function  showInfoPopup(name) {
    if(isPopupShowed) {
      addListener(name);
    } else {
      isPopupShowed = true;

      var ionicPopup =  $injector.get('$ionicPopup');

      if(infoPopup && typeof infoPopup.close === 'function') {
        infoPopup.close();
      }

      clearTimeout(listeners[name]);
      delete listeners[name];

      if(cordova.plugins && cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      infoPopup = ionicPopup.alert({
        title: 'Bad Connection. Trying to Connect...',
        template: '<i class="icon ion-loading-c"></i>',
        cssClass: 'bad-connection',
        buttons: []
      });

      currentPopupRequestId = name;
    }
  }

  function cleanAllListeners() {
    Object.keys(listeners).forEach(function(key) {
      clearTimeout(listeners[key]);
      delete listeners[key];
    });

    listeners = {};

    hidePopup();
  }

  //function checkStatus() {
  //  if(Object.keys(listeners).length > 0) {
  //    return;
  //  }
  //
  //  hidePopup();
  //}

  function hidePopup() {
    if(infoPopup && typeof infoPopup.close === 'function') {
      infoPopup.close();
    }

    isPopupShowed = false;
    currentPopupRequestId = null;
  }

  return {
    addListener: addListener,
    removeListener: removeListener,
    cleanAllListeners: cleanAllListeners//,
    //checkStatus: checkStatus
  }

}]);
