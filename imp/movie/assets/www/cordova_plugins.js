cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "code-push.AcquisitionManager",
        "file": "plugins/code-push/script/acquisition-sdk.js",
        "pluginId": "code-push",
        "merges": [
            "window"
        ]
    },
    {
        "id": "com.adjust.sdk.Adjust",
        "file": "plugins/com.adjust.sdk/www/adjust.js",
        "pluginId": "com.adjust.sdk",
        "clobbers": [
            "Adjust"
        ]
    },
    {
        "id": "com.adjust.sdk.AdjustConfig",
        "file": "plugins/com.adjust.sdk/www/adjust_config.js",
        "pluginId": "com.adjust.sdk",
        "clobbers": [
            "AdjustConfig"
        ]
    },
    {
        "id": "com.adjust.sdk.AdjustEvent",
        "file": "plugins/com.adjust.sdk/www/adjust_event.js",
        "pluginId": "com.adjust.sdk",
        "clobbers": [
            "AdjustEvent"
        ]
    },
    {
        "id": "cordova-plugin-3dtouch.ThreeDeeTouch",
        "file": "plugins/cordova-plugin-3dtouch/www/ThreeDeeTouch.js",
        "pluginId": "cordova-plugin-3dtouch",
        "clobbers": [
            "ThreeDeeTouch"
        ]
    },
    {
        "id": "cordova-plugin-android-idfa.androidIDFA",
        "file": "plugins/cordova-plugin-android-idfa/www/androidIDFA.js",
        "pluginId": "cordova-plugin-android-idfa",
        "merges": [
            "androidIDFA"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification_android",
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-globalization.GlobalizationError",
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "id": "cordova-plugin-globalization.globalization",
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-apprate.AppRate",
        "file": "plugins/cordova-plugin-apprate/www/AppRate.js",
        "pluginId": "cordova-plugin-apprate",
        "clobbers": [
            "AppRate"
        ]
    },
    {
        "id": "cordova-plugin-apprate.locales",
        "file": "plugins/cordova-plugin-apprate/www/locales.js",
        "pluginId": "cordova-plugin-apprate",
        "runs": true
    },
    {
        "id": "cordova-plugin-file.DirectoryEntry",
        "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "id": "cordova-plugin-file.DirectoryReader",
        "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "id": "cordova-plugin-file.Entry",
        "file": "plugins/cordova-plugin-file/www/Entry.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "id": "cordova-plugin-file.File",
        "file": "plugins/cordova-plugin-file/www/File.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "id": "cordova-plugin-file.FileEntry",
        "file": "plugins/cordova-plugin-file/www/FileEntry.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "id": "cordova-plugin-file.FileError",
        "file": "plugins/cordova-plugin-file/www/FileError.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "id": "cordova-plugin-file.FileReader",
        "file": "plugins/cordova-plugin-file/www/FileReader.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "id": "cordova-plugin-file.FileSystem",
        "file": "plugins/cordova-plugin-file/www/FileSystem.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "id": "cordova-plugin-file.FileUploadOptions",
        "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "id": "cordova-plugin-file.FileUploadResult",
        "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "id": "cordova-plugin-file.FileWriter",
        "file": "plugins/cordova-plugin-file/www/FileWriter.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "id": "cordova-plugin-file.Flags",
        "file": "plugins/cordova-plugin-file/www/Flags.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "id": "cordova-plugin-file.LocalFileSystem",
        "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "id": "cordova-plugin-file.Metadata",
        "file": "plugins/cordova-plugin-file/www/Metadata.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "id": "cordova-plugin-file.ProgressEvent",
        "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "id": "cordova-plugin-file.fileSystems",
        "file": "plugins/cordova-plugin-file/www/fileSystems.js",
        "pluginId": "cordova-plugin-file"
    },
    {
        "id": "cordova-plugin-file.requestFileSystem",
        "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
        "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "window"
        ]
    },
    {
        "id": "cordova-plugin-file.isChrome",
        "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "id": "cordova-plugin-file.androidFileSystem",
        "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "FileSystem"
        ]
    },
    {
        "id": "cordova-plugin-file.fileSystems-roots",
        "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "id": "cordova-plugin-file.fileSystemPaths",
        "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "cordova"
        ],
        "runs": true
    },
    {
        "id": "cordova-plugin-file-transfer.FileTransferError",
        "file": "plugins/cordova-plugin-file-transfer/www/FileTransferError.js",
        "pluginId": "cordova-plugin-file-transfer",
        "clobbers": [
            "window.FileTransferError"
        ]
    },
    {
        "id": "cordova-plugin-file-transfer.FileTransfer",
        "file": "plugins/cordova-plugin-file-transfer/www/FileTransfer.js",
        "pluginId": "cordova-plugin-file-transfer",
        "clobbers": [
            "window.FileTransfer"
        ]
    },
    {
        "id": "cordova-plugin-zip.Zip",
        "file": "plugins/cordova-plugin-zip/zip.js",
        "pluginId": "cordova-plugin-zip",
        "clobbers": [
            "zip"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-code-push.codePush",
        "file": "plugins/cordova-plugin-code-push/bin/www/codePush.js",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "codePush"
        ]
    },
    {
        "id": "cordova-plugin-code-push.localPackage",
        "file": "plugins/cordova-plugin-code-push/bin/www/localPackage.js",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "LocalPackage"
        ]
    },
    {
        "id": "cordova-plugin-code-push.remotePackage",
        "file": "plugins/cordova-plugin-code-push/bin/www/remotePackage.js",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "RemotePackage"
        ]
    },
    {
        "id": "cordova-plugin-code-push.syncStatus",
        "file": "plugins/cordova-plugin-code-push/bin/www/syncStatus.js",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "SyncStatus"
        ]
    },
    {
        "id": "cordova-plugin-code-push.installMode",
        "file": "plugins/cordova-plugin-code-push/bin/www/installMode.js",
        "pluginId": "cordova-plugin-code-push",
        "clobbers": [
            "InstallMode"
        ]
    },
    {
        "id": "cordova-plugin-code-push.codePushUtil",
        "file": "plugins/cordova-plugin-code-push/bin/www/codePushUtil.js",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "id": "cordova-plugin-code-push.fileUtil",
        "file": "plugins/cordova-plugin-code-push/bin/www/fileUtil.js",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "id": "cordova-plugin-code-push.httpRequester",
        "file": "plugins/cordova-plugin-code-push/bin/www/httpRequester.js",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "id": "cordova-plugin-code-push.nativeAppInfo",
        "file": "plugins/cordova-plugin-code-push/bin/www/nativeAppInfo.js",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "id": "cordova-plugin-code-push.package",
        "file": "plugins/cordova-plugin-code-push/bin/www/package.js",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "id": "cordova-plugin-code-push.sdk",
        "file": "plugins/cordova-plugin-code-push/bin/www/sdk.js",
        "pluginId": "cordova-plugin-code-push",
        "runs": true
    },
    {
        "id": "cordova-plugin-facebook4.FacebookConnectPlugin",
        "file": "plugins/cordova-plugin-facebook4/www/facebook-native.js",
        "pluginId": "cordova-plugin-facebook4",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "id": "cordova-plugin-google-analytics.UniversalAnalytics",
        "file": "plugins/cordova-plugin-google-analytics/www/analytics.js",
        "pluginId": "cordova-plugin-google-analytics",
        "clobbers": [
            "analytics",
            "ga"
        ]
    },
    {
        "id": "cordova-plugin-googleplus.GooglePlus",
        "file": "plugins/cordova-plugin-googleplus/www/GooglePlus.js",
        "pluginId": "cordova-plugin-googleplus",
        "clobbers": [
            "window.plugins.googleplus"
        ]
    },
    {
        "id": "cordova-plugin-nativestorage.mainHandle",
        "file": "plugins/cordova-plugin-nativestorage/www/mainHandle.js",
        "pluginId": "cordova-plugin-nativestorage",
        "clobbers": [
            "NativeStorage"
        ]
    },
    {
        "id": "cordova-plugin-nativestorage.LocalStorageHandle",
        "file": "plugins/cordova-plugin-nativestorage/www/LocalStorageHandle.js",
        "pluginId": "cordova-plugin-nativestorage"
    },
    {
        "id": "cordova-plugin-nativestorage.NativeStorageError",
        "file": "plugins/cordova-plugin-nativestorage/www/NativeStorageError.js",
        "pluginId": "cordova-plugin-nativestorage"
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "cordova-plugin-whitelist.whitelist",
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "pluginId": "cordova-plugin-x-socialsharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "id": "es6-promise-plugin.Promise",
        "file": "plugins/es6-promise-plugin/www/promise.js",
        "pluginId": "es6-promise-plugin",
        "runs": true
    },
    {
        "id": "ionic-plugin-keyboard.keyboard",
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "id": "phonegap-plugin-push.PushNotification",
        "file": "plugins/phonegap-plugin-push/www/push.js",
        "pluginId": "phonegap-plugin-push",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "id": "twitter-connect-plugin.TwitterConnect",
        "file": "plugins/twitter-connect-plugin/www/TwitterConnect.js",
        "pluginId": "twitter-connect-plugin",
        "clobbers": [
            "TwitterConnect"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "code-push": "1.6.0-beta",
    "com.adjust.sdk": "4.3.0",
    "com.aquto.cordova.AppleAdvertising": "0.0.1",
    "cordova-custom-config": "2.0.3",
    "cordova-plugin-3dtouch": "1.3.5",
    "cordova-plugin-android-idfa": "1.0.4",
    "cordova-plugin-dialogs": "1.2.0",
    "cordova-plugin-globalization": "1.0.3",
    "cordova-plugin-inappbrowser": "1.2.1",
    "cordova-plugin-apprate": "1.1.7",
    "cordova-plugin-file": "4.1.1",
    "cordova-plugin-file-transfer": "1.5.0",
    "cordova-plugin-zip": "3.0.0",
    "cordova-plugin-device": "1.1.1",
    "cordova-plugin-code-push": "1.8.1-beta",
    "cordova-plugin-console": "1.0.2",
    "cordova-plugin-crosswalk-webview": "1.5.0",
    "cordova-plugin-facebook4": "1.7.1",
    "cordova-plugin-google-analytics": "1.5.6",
    "cordova-plugin-googleplus": "4.0.9",
    "cordova-plugin-nativestorage": "2.0.2",
    "cordova-plugin-network-information": "1.2.1",
    "cordova-plugin-splashscreen": "3.2.1",
    "cordova-plugin-statusbar": "2.1.2",
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-x-socialsharing": "5.0.12",
    "es6-promise-plugin": "3.0.2",
    "ionic-plugin-keyboard": "2.0.1",
    "phonegap-plugin-push": "1.8.1",
    "twitter-connect-plugin": "0.5.0"
};
// BOTTOM OF METADATA
});