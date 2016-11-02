'use strict';

/**
* @ngdoc service
* @name starter.analyticsService
* @requires ng.$rootScope
* @requires $cordovaGoogleAnalytics
* @requires ANALYTICS_ID
* @description
* Google analytics service to capture user behaviour statistics
*/
angular.module('starter')
    .service('analyticsService', function ($rootScope, $cordovaGoogleAnalytics, ANALYTICS_ID) {

        /**
         * @ngdoc function
         * @methodOf starter.analyticsService
         * @name starter.analyticsService#init
         * @kind function
         * 
         * @description
         * Google analytics service. Captures page views.
         *
         */
        this.init = function () {
            $cordovaGoogleAnalytics.debugMode();
            $cordovaGoogleAnalytics.startTrackerWithId(ANALYTICS_ID);
            $cordovaGoogleAnalytics.setUserId(device.uuid + '@i2cs.com');

            $rootScope.$on('$ionicView.enter', function (event, data) {
                $cordovaGoogleAnalytics.trackView(data.title);
            });
        }
    });
