cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraConstants.js",
        "id": "org.apache.cordova.camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverOptions.js",
        "id": "org.apache.cordova.camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/Camera.js",
        "id": "org.apache.cordova.camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverHandle.js",
        "id": "org.apache.cordova.camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.viceversa.languagePlugin/www/languagePlugin.js",
        "id": "com.viceversa.languagePlugin.languagePlugin",
        "clobbers": [
            "plugin.languagePlugin"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/com.viceversa.imageCombine/www/imageCombine.js",
        "id": "com.viceversa.imageCombine.ImageCombine",
        "clobbers": [
            "plugin.imageCombine"
        ]
    },
    {
        "file": "plugins/com.viceversa.ParseSaveEventually/www/ParseSaveEventually.js",
        "id": "com.viceversa.ParseSaveEventually.ParseSaveEventually",
        "clobbers": [
            "plugin.ParseSaveEventually"
        ]
    },
    {
        "file": "plugins/com.viceversa.TwitterPlugin/www/TwitterPlugin.js",
        "id": "com.viceversa.TwitterPlugin.TwitterPlugin",
        "clobbers": [
            "plugin.TwitterPlugin"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.Flurry/www/flurryPlugin.js",
        "id": "com.phonegap.plugins.Flurry.FlurryPlugin",
        "clobbers": [
            "FlurryPlugin"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.launchmyapp/www/android/LaunchMyApp.js",
        "id": "nl.x-services.plugins.launchmyapp.LaunchMyApp",
        "clobbers": [
            "window.plugins.launchmyapp"
        ]
    },
    {
        "file": "plugins/com.viceversa.parsePushNotifications/www/parsePushNotifications.js",
        "id": "com.viceversa.parsePushNotifications.ParsePushNotifications",
        "clobbers": [
            "plugin.parse_push"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "1.0.3",
    "org.apache.cordova.engine.crosswalk": "0.0.1-dev",
    "org.apache.cordova.inappbrowser": "0.5.5-dev",
    "nl.x-services.plugins.socialsharing": "4.3.12",
    "org.apache.cordova.statusbar": "0.1.9",
    "org.apache.cordova.console": "0.2.12",
    "org.apache.cordova.camera": "0.3.4",
    "org.apache.cordova.device": "0.2.13",
    "com.viceversa.languagePlugin": "0.1.0",
    "org.apache.cordova.splashscreen": "0.3.6-dev",
    "com.phonegap.plugins.facebookconnect": "0.11.0",
    "com.viceversa.imageCombine": "0.1.0",
    "com.viceversa.ParseSaveEventually": "0.1.0",
    "com.viceversa.TwitterPlugin": "0.1.0",
    "com.phonegap.plugins.Flurry": "3.3.6",
    "nl.x-services.plugins.launchmyapp": "3.2.2",
    "com.viceversa.parsePushNotifications": "0.1.0",
    "com.viceversa.flurryLib": "0.1.0",
    "com.google.playservices": "21.0.0",
    "android.support.v4": "21.0.1"
}
// BOTTOM OF METADATA
});