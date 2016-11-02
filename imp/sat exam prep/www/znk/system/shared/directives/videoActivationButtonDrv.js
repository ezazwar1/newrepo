'use strict';

(function (angular) {
    angular.module('znk.sat').directive('videoActivationButtonDrv', ['$window', '$http', 'NetworkSrv', 'PopUpSrv', 'ErrorHandlerSrv', 'EnumSrv', 'ENV',
        function ($window, $http, NetworkSrv, PopUpSrv, ErrorHandlerSrv, EnumSrv, ENV) {
            return {
                restrict: 'E',
                templateUrl: 'znk/system/shared/templates/videoActivationButton.html',
                scope:{
                    videoType: '=',
                    contentId: '=',
                    playVideo: '&ngClick'
                },
                link: function(scope, element, attr) {
                    var videoUrl = undefined;
                    scope.disabledButton = true;
                    scope.analyticsLabel='';
                    scope.isLoading = true;

                    function videoIsMissing(){
                        scope.label = 'Video is not available';
                        //the assignment to scope.label happend too late and the ui is not display the correct value
                        attr.$set('label','Video is not available');
                        scope.isLoading = false;
                    }

                    // validates the plugin
                    function isPluginsValid() {
                       return !!$window.plugins && $window.plugins.streamingMedia;
                    }

                    function getVideoUrl() {
                        var result = undefined;

                        var urlTypePart = '';

                        // read videos end-point
                        var videosEndPoint = ENV.videosEndpoint;
                        if (videosEndPoint.lastIndexOf('/', videosEndPoint.length - 1) !== videosEndPoint.length - 1) {
                            videosEndPoint += '/';
                        }

                        switch(scope.videoType) {
                            case EnumSrv.exerciseType.tutorial.enum:
                                urlTypePart = 'tutorials';
                                scope.label = 'Video Tutorial';
                                break;
                            default:
                                //question isn't part of EnumSrv.exerciseType...
                                urlTypePart = 'questions';
                                scope.label = 'Video Solution';
                                break;
                        }

                        if (urlTypePart !== '') {
                            // set full video url
                            result = videosEndPoint + 'videos/' + urlTypePart + '/' + scope.contentId + '.mp4';
                            scope.analyticsLabel = urlTypePart + '-' + scope.contentId;
                        }

                        return result;
                    }

                    if (isPluginsValid()) {
                        var videoUrl = getVideoUrl();

                        // verify that the videoUrl has value
                        if (undefined != videoUrl) {
                            //check if video url exits by sending HEAD request
                            $http({
                                method: 'HEAD',
                                url: videoUrl // append videos end-point to the url to get the full url
                            })
                            // in case something needs to be checked in the callbacks, add "response" parameter to each callback
                            .then(function successCallback() {
                                scope.disabledButton = false;
                                scope.isLoading = false;
                            }, function errorCallback() {
                                scope.disabledButton = true;
                                videoIsMissing();
                            });
                        }
                    }
                    else{
                        //PC Only
                        videoIsMissing();
                    }

                    scope.playVideo = function playVideo() {
                        // check if user is online
                        if (NetworkSrv.isDeviceOffline()) {
                            // device is offline. Display an error
                            PopUpSrv.error(null, ErrorHandlerSrv.messages.noInternetConnection);
                            return;
                        }
                        else {
                            var options = {
                                successCallback: function() {
                                      
                                },
                                errorCallback: function(errMsg) {
                                      
                                }
                            };
                            $window.plugins.streamingMedia.playVideo(videoUrl, options);
                        }
                    };
                }
            };
        }
    ]);
})(angular);

