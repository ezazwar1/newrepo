'use strict';
/*
     options
     link
     caption
     description
     picture
     name
 */
(function(angular) {

    angular.module('znk.sat').directive('facebookShareBtn', ['$cordovaSocialSharing', '$analytics', '$window', facebookShareBtn]);

    function facebookShareBtn($cordovaSocialSharing, $analytics, $window) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                options: "="
            },
            link: function(scope) {

                if(!scope.options) { scope.options = {} }

                var canShare;

                scope.showIcon = false;

                if($window.plugins && $window.plugins.socialsharing) {
                      canShare = ionic.Platform.isIOS() ?  'com.apple.social.facebook' : 'com.facebook.katana';
                      $cordovaSocialSharing.canShareVia(canShare).then(function() {
                              scope.showIcon = true;
                      }, function() {
                              scope.showIcon = false;
                      });
                }

                var isClicked = false;

                scope.openFacebookDialog = function() {

                    if(!isClicked) {

                        isClicked = true;

                        $cordovaSocialSharing
                            .shareViaFacebook(scope.options.description, scope.options.picture, null)
                            .then(function() {
                                $analytics.eventTrack('facebook-share', {
                                    category: 'share',
                                    label: 'share open success'
                                });
                                isClicked = false;
                            }, function() {
                                $analytics.eventTrack('facebook-share', {
                                    category: 'share',
                                    label: 'share open error'
                                });
                                isClicked = false;
                            });
                    }

                };


            },
            templateUrl: 'znk/system/shared/templates/facebookShareBtn.html'
        };
    }

})(angular);
