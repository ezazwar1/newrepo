'use strict';

/**
* @ngdoc directive
* @name starter.directive:analyticsClick
* @require $cordovaGoogleAnalytics
* @description
* Tracks user events and save them to be sent to Google Analytics. 
* @example
<pre>
    <a analytics-click="Product"></a>
</pre>
*/
angular.module('starter')
    .directive('analyticsClick', function ($cordovaGoogleAnalytics) {
        return {
            scope: {
                analyticsClick: '@analyticsClick'
            },
            controller: function ($scope, $element, $attrs) {
                document.addEventListener("deviceready", function () {
                    $element.bind('click', function () {
                        if ($attrs['href']) {
                            $cordovaGoogleAnalytics.trackEvent('Click', $scope.analyticsClick || "Other", $attrs['href']);
                        }else if ($attrs['data-product-name']) {
                            $cordovaGoogleAnalytics.trackEvent('Click', $scope.analyticsClick || "Other", $attrs['data-product-name']);
                        }
                    });
                });
            }
        }
    });