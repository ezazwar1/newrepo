cordova.define("com.fiksu.sdk.Fiksu", function(require, exports, module) {
var exec = require('cordova/exec');

module.exports = (function() {
  "use strict";
  var state = {
    clientID: null,
    appTrackingEnabled: null
  };
  
  var lastPushedState = {
    clientID: null,
    appTrackingEnabled: null
  };

  var configKeys = {
    ITUNES_APPLICATION_ID: "iTunesApplicationID",
    DEBUG_MODE_ENABLED: "debugModeEnabled"
  };
  
  var softExceptionMessages = {};

  // Used to verify the receipt creation methods are the only
  // path to sending down a receipt object.
  var purchaseReceiptCreatorSecret = Object.freeze({});
  
  // Use in place of throwing an exception.
  var softException = function(message) {
    console.log(message);
    // Use console.trace if it's available AND if we haven't already output a trace
    // for this message (keeps the logs from overloading)
    if (!softExceptionMessages.hasOwnProperty(message)) {
      console.trace();
      softExceptionMessages[message] = true;
    }
  }

  var isValidConfiguration = function(configuration) {
    var isValid = Object.prototype.toString.call(configuration) == "[object Object]";
    
    if (!isValid) {
      softException("initialize: Invalid configuration, configuration must be JSON");
      return isValid;
    }

    if(configuration[configKeys.ITUNES_APPLICATION_ID]) {
      var isValidAppId = "string" == typeof configuration[configKeys.ITUNES_APPLICATION_ID];
      isValid = isValid && isValidAppId;
      if (!isValidAppId) {
        softException("initialize: Invalid configuration, " + configKeys.ITUNES_APPLICATION_ID + " must be a string");
      }
    }

    if(configuration[configKeys.DEBUG_MODE_ENABLED]) {
      var isValidDebugMode = "boolean" == typeof configuration[configKeys.DEBUG_MODE_ENABLED];
      isValid = isValid && isValidDebugMode
      if(!isValidDebugMode) {
         softException("initialize: Invalid configuration, " + configKeys.DEBUG_MODE_ENABLED + " must be a boolean");
      }
    }

    var validKeys = [];
    for (var key in configKeys) {
      validKeys.push(configKeys[key]);
    }

    for (var key in configuration) {
      if (validKeys.indexOf(key) == -1) {
        softException("initialize: Ignoring configuration key: " + key);
      }
    }

    return isValid;
  }

  if (typeof console.trace === 'undefined') {
    softException = function(message) {
      console.log(message);
    };
  }

  function updateState(callback) {
    var stateDifference = {};
    
    if (state.clientID != lastPushedState.clientID) {
      stateDifference['clientID'] = lastPushedState.clientID = state.clientID;
    }
    
    if (state.appTrackingEnabled != lastPushedState.appTrackingEnabled) {
      stateDifference['appTrackingEnabled'] = lastPushedState.appTrackingEnabled = state.appTrackingEnabled;
    }

    callback(stateDifference);
  };

  function callFTM(methodName, params) {
    params = params || [];
    updateState(function(changedState) {
      var p = params.slice(0);
      p.unshift(changedState);
      exec(null, null, "FiksuTrackingManager", methodName, p);
    })  
  }
  
  var ftm = {
    
    RegistrationEvent: {
      Event1: {value: 0},
      Event2: {value: 1},
      Event3: {value: 2}
    },

    PurchaseEvent: {
      Event1: {value: 0},
      Event2: {value: 1},
      Event3: {value: 2},
      Event4: {value: 3},
      Event5: {value: 4}
    },
    
    /*
    * Example Configuration:
    * {
    *   iTunesApplicationID: "000000000",
    *   debugModeEnabled: true
    * }
    *
    * iTunesApplicationID
    * Description: The ID of your application in iTunesConnect.    
    * Format:      9-digit number as a string e.g. "000000000"   
    * Default:     none    
    * REQUIRED FOR iOS
    *
    * debugModeEnabled
    * Description: Outputs diagnostic info to the log. If iOS, pops up ViewController to show status of SDK   
    * Format:      boolean e.g. true | false   
    * Default:     false
    */
    initialize: function(configuration) {
      if(configuration) {
        if(isValidConfiguration(configuration)) {
          callFTM("initialize", [configuration]);
        }
        else {
          callFTM("initialize", [{}]);
        }
      }
      else {
        callFTM("initialize");
      }
    },

    uploadCustomEvent: function() {
      callFTM("uploadCustomEvent");
    },

    uploadRegistration: function(eventID) {
      if (!eventID) {
        softException("uploadRegistration: You must specify the 'eventID' parameter, not " + typeof eventID);
        return;
      }
      
      for (var key in ftm.RegistrationEvent) {
        if (ftm.RegistrationEvent.hasOwnProperty(key)) {
          if (ftm.RegistrationEvent[key] === eventID) {
            callFTM("uploadRegistration", [eventID.value]);
            return;
          }
        }
      }
      softException("You must use the FiksuTrackingManager.RegistrationEvent enumeration, not " + typeof eventID);
    },

    uploadPurchase: function(eventID, price, currency, receipt) {
      if (!eventID) {
        softException("uploadPurchase: You must specify the 'eventID' parameter, not " + typeof eventID);
        return;
      }
      
      if (!price || typeof price != 'number') {
        softException("uploadPurchase: You must specify the 'price' parameter (as a number), not " + typeof price);
        return;
      }
      
      currency = currency || null;
      
      if (currency && typeof currency != 'string') {
        softException("uploadPurchase: You must specify the 'currency' parameter (as a string or null), not " + typeof currency);
        return;
      }
      
      receipt = receipt || null;

      if (receipt) {
        if (typeof receipt != 'object' || !receipt.hasOwnProperty('secret') || receipt['secret'] !== purchaseReceiptCreatorSecret) {
          softException("uploadPurchase: You must specify the 'receipt' parameter by using iOSPurchaseReceipt() or androidPurchaseReceipt()");
          return;
        }
        delete receipt.secret; // we don't need to send this down.
      }
      
      for (var key in ftm.PurchaseEvent) {
        if (ftm.PurchaseEvent.hasOwnProperty(key)) {
          if (ftm.PurchaseEvent[key] === eventID) {
            callFTM("uploadPurchase", [eventID.value, price, currency, receipt]);
            return;
          }
        }
      }
      softException("uploadPurchase: You must use the FiksuTrackingManager.PurchaseEvent enumeration, not " + typeof eventID);
    },

    iOSPurchaseReceipt: function(receiptAsBase64EncodedString) {
      if (receiptAsBase64EncodedString === null || receiptAsBase64EncodedString === undefined || typeof receiptAsBase64EncodedString != 'string') {
        softException("iOSPurchaseReceipt: You must specify the 'receiptAsBase64EncodedString' parameter (as a string), not " + typeof receiptAsBase64EncodedString);
        return null;
      }
      
      return {ios: {data: receiptAsBase64EncodedString}, secret: purchaseReceiptCreatorSecret};
    },

    androidPurchaseReceipt: function(data, signature) {
      if (data === null || data === undefined || typeof data != 'string') {
        softException("androidPurchaseReceipt: You must specify the 'data' parameter (as a string), not " + typeof data);
        return null;
      }
      
      if (signature === null || signature === undefined || typeof signature != 'string') {
        softException("androidPurchaseReceipt: You must specify the 'signature' parameter (as a string), not " + typeof signature);
        return null;
      }
      
      return {android: {data: data, signature: signature}, secret: purchaseReceiptCreatorSecret};
    },

    get clientID(){
      return state.clientID;
    },

    set clientID(val){
      if (val && typeof(val) != 'string') {
        softException("clientID must be a string or null, not " + typeof val);
        return;
      }
      return state.clientID = val;
    },

    get appTrackingEnabled(){
      return state.appTrackingEnabled;
    },

    set appTrackingEnabled(val){
      if (val && typeof(val) != 'boolean') {
        softException("appTrackingEnabled must be a string or null, not " + typeof val);
        return;
      }
      return state.appTrackingEnabled = val;
    }

    // @include ../tests/javascript/trackingHelper.js
  };

  // So no one can mess with our enums
  Object.freeze(ftm.RegistrationEvent);
  Object.freeze(ftm.PurchaseEvent);

  return ftm;
}());

});
