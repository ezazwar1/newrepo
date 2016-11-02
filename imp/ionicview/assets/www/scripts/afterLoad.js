/*
 * This script is injected into the iAB after cordova.js and after window load.
 */

/*
 * Fake 'onFileSystemPathsReady' since we disallow access to the file plugin and
 * deviceready waits on it. Wait for onCordovaReady so that the file plugin has
 * said to wait for onFileSystemPathsReady and navigator.app.exitApp has been
 * set.
 */
var channel = cordova.require('cordova/channel')
channel.onCordovaReady.subscribe(function() {
  channel.initializationComplete('onFileSystemPathsReady')

  // on Android, we just want to close the iAB, not exit the whole app
  // Cordova sets navigator.app after onPluginsReady but before onCordovaReady
  if (navigator.app) {
    navigator.app.exitApp = function closeIAB() {
      return cordova.exec(null, null, "closeIAB", "", []);
    }
  }
})

