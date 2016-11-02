angular.module('instacafe', [
    'ionic',
    'ngCordova',
    'AngularGM',
    'instacafe.controllers',
    'instacafe.services',
    'instacafe.api',
    'instacafe.directives',
    'instacafe.constant',
    'instacafe.config',
])

.run(function ($ionicPlatform, $rootScope, $ionicPopup, $q, $cordovaAppRate,
               connectionErrorMessaage, Restangular, ANALYTICS_TRACKING_ID,
               IOS_PUBLISHER_KEY, ANDROID_PUBLISHER_KEY) {

    $ionicPlatform.ready(function () {

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
            if (response.status !== 200 && response.status !== 404 && response.status !== 500) {
                $rootScope.$broadcast('errorPopup:show');
                $q.reject(response); // error handled
            }
            return true; // error not handled
        });

        $rootScope.$on('errorPopup:show', function () {
            $ionicPopup.alert(connectionErrorMessaage);
        });

        // Admob
        if (typeof AdMob !== 'undefined') {
            var admobid;
            if (ionic.Platform.isIOS()) {
                admobid = IOS_PUBLISHER_KEY;
            } else {
                admobid = ANDROID_PUBLISHER_KEY;
            }
            AdMob.createBanner({
                adId: admobid,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true,
                isTesting: false
            });
        }

        // GoogleAnalytics
        if (typeof analytics !== 'undefined') {
            analytics.startTrackerWithId(ANALYTICS_TRACKING_ID);
        }

        if (typeof AppRate !== 'undefined') {
            $cordovaAppRate.promptForRating();
        }
    });
});
