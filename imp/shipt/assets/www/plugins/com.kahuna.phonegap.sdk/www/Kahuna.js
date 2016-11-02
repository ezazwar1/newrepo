cordova.define("com.kahuna.phonegap.sdk.Kahuna", function(require, exports, module) { /*
 * Kahuna CONFIDENTIAL
 * __________________
 *
 *  2012 - 2015 Kahuna, Inc.
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Kahuna, Inc. and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Kahuna, Inc.
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Kahuna, Inc.
 *
 * Kahuna PhoneGap JS Library (Beta)
 */

function Kahuna() {};

/**
 * Use 'launchWithKey' API instead. 'launchWithKey' should be called inside 'onDeviceReady' event
 * @param key Your Kahuna Secret Key
 * @param senderId (optional) GCM SenderId for Android Push. Can pass in null if not supporting Android Push.
 */
Kahuna.prototype.startWithKey = function(key, senderId) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'startWithKey', [key, senderId]);
};

/**
 * Should be called from the 'onDeviceReady' event handler from index.js
 * @param key Your Kahuna Secret Key
 * @param senderId (optional) GCM SenderId for Android Push. Can pass in null if not supporting Android Push.
 */
Kahuna.prototype.launchWithKey = function(key, senderId) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'launchWithKey', [key, senderId]);
};

/**
 * Should be called from the 'onResume' event handler from index.js
 */
Kahuna.prototype.onStart = function() {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'onStart', []);
};

/**
 * Should be called from the 'onPaused' event handler from index.js
 */
Kahuna.prototype.onStop = function() {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'onStop', []);
};

/**
 * Should be called to track custom event for Kahuna. (ex trackEvent('sign in');)
 * @param event String event name to track.
 */
Kahuna.prototype.trackEvent = function(event) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'trackEvent', [event]);
};

/**
 * Should be called to track a Kahuna Event object. Use the Kahuna Event Builder to build
 * a Kahuna Event object for tracking.
 * @param event A Kahuna Event object that can be built using the Kahuna Event Builder.
 */
Kahuna.prototype.track = function(event) {
    var propertiesMap = event.getPropertiesAsMap();
    cordova.exec(function() {}, function() {}, 'Kahuna', 'track', [event.eventName, event.count, event.value, propertiesMap]);
};

/**
 * @Deprecated Use Kahuna.login() instead for logging in your users.
 * Used to track Unique user credentials for the user. Should be called on app start if the user
 * is already logged in, and also when the user completes a sign in. (optional)
 * @param username (optional) Unique username for your application. Can pass in null if not supported.
 * @param email (optional) Email address for the user of your application. Can pass in null if not supported.
 */
Kahuna.prototype.setUserCredentials = function(username, email) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'setUserCredentials', [username, email]);
};

/*
 * Used to track Unique user credentials for the user. Should be called on app start if the user
 * is already logged in, and also when the user completes a sign in. 
 * @param userCredentials KahunaUserCredentials for the login.
 */
Kahuna.prototype.login = function(userCredentials) {
	var credentialsMap = userCredentials.getCredentialsMap();
	cordova.exec(function() {}, function() {}, 'Kahuna', 'login', [credentialsMap]);
};

/**
 * Must be called when the user signs out of your application. This will disassociate the user from the
 * device and allow a new user to login for the next sign in event.
 * (optional unless using Kahuna.setUserCredentials)
 */
Kahuna.prototype.logout = function() {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'logout', []);
};

/**
 * Used to track any user attributes for the user. Example of some user attributes are 'first_name', 'last_name',
 * 'birth_day'[1-31], 'birth_month'[1-12], 'birth_year'. User attributes will be cleared when calling Kahuna.logout().
 * @param userAttributes Dictionary of String key/value pairs of user attributes.
 */
Kahuna.prototype.setUserAttributes = function(userAttributes) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'setUserAttributes', [userAttributes]);
};

/**
 * Used to enable Push support for Android/iOS implementations. Does nothing if Push is already enabled for the
 * application. 
 * NOTE : By default Push is enabled for the user in Android upon app install unless you make an explicit
 * call to Kahuna.disablePush(). 
 */
Kahuna.prototype.enablePush = function(notificationTypes) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'enablePush', [notificationTypes]);
};

/**
 * (Android Only)
 * Used to disable Push support for Android implementations. Does nothing if Push is already disabled for the
 * application. By default Push is Enabled for the user in Android upon app install unless you make an explicit
 * call to Kahuna.disablePush(). This call is ignored for iOS implementations since the OS controls Push enablement.
 */
Kahuna.prototype.disablePush = function() {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'disablePush', []);
};

/**
 * Used to enable debug logging in the native iOS and Android applications. Logs are written to NSLog for iOS and
 * Logcat for Android. Useful for debugging. Can be called before 'Kahuna.startWithKey()' for best results.
 * NOTE: Remember to remove all calls to Kahuna.setDebugMode before submitting your app to the production app stores.
 * @param enable
 */
Kahuna.prototype.setDebugMode = function(enable) {
	cordova.exec(function() {}, function() {}, 'Kahuna', 'setDebugMode', [enable]);
};

/**
 * Used to set a callback function for In App Messages.
 */
Kahuna.prototype.setKahunaCallback = function(value) {
    cordova.exec(value, function() {}, 'Kahuna', 'setKahunaCallback', [value]);
};
  
var objK = new Kahuna();
module.exports = objK;

});
