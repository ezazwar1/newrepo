/*
 * This file is copied into each downloaded app's directory as cordova.js.
 * Since each index.html expects there to be a cordova.js file, we piggyback
 * off it to include code that will run before window load, since we normally
 * can't inject scripts into iAB until after load.
 */

/*
 * Hack to trick Ionic into thinking that it should wait for 'deviceready',
 * since isWebView() (used by Platform.ready) will return false unless
 * window.cordova is present.
 *
 * We create an element to avoid 'cordova already defined' error, since they
 * account for the case of having an element with id="cordova" on window.
 * See https://issues.apache.org/jira/browse/CB-9342.
 */
window.cordova = document.createElement('div')

window.ionicView = true
