/**
 * attrs:
 *      video-height:
 *          "fit"
 *      on-ended
 *      on-canplay
 *      custom-poster
 *      actions:
 *          replay
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('videoCtrlDrv', [
        '$timeout',
        function ($timeout) {
            var videoHeightType = {
                FIT: 'fit'
            };
            return {
                transclude: 'element',
                scope:{
                    onEnded: '&?',
                    actions: '=?',
                    heightToWidthRatioGetter: '&heightToWidthRatio',
                    videoHeight: '@'
                },
                link: function(scope, element, attrs, ctrl, transclude) {
                    var posterMaskElement;
                    var parentElem = element.parent();
                    var parentDomElem = parentElem[0];

                    function getDimension(dimensionsType){
                        var containerWidth, containerHeight;

                        switch (dimensionsType){
                            case videoHeightType.FIT:
                                var heightToWidthRatio = scope.heightToWidthRatioGetter();
                                heightToWidthRatio = +heightToWidthRatio;
                                var heightSizeByWidth = parentDomElem.offsetWidth * heightToWidthRatio;
                                if (heightSizeByWidth <= parentDomElem.offsetHeight) {
                                    containerWidth = parentDomElem.offsetWidth;
                                    containerHeight = heightSizeByWidth;
                                } else {
                                    containerHeight = parentDomElem.offsetHeight;
                                    containerWidth = containerHeight / heightToWidthRatio;
                                }

                                containerWidth = Math.round(containerWidth);
                                containerHeight = Math.round(containerHeight);
                                //black line bug fix for iphone 4
                                containerHeight = containerHeight + ((containerHeight % 2) ? 0 : 1);
                                break;
                        }

                        if(!containerWidth || !containerHeight){
                            return null;
                        }

                        return {
                            width: containerWidth,
                            height: containerHeight
                        }
                    }

                    function addCustomPoster(){
                        if (attrs.customPoster) {
                            var dimensions = getDimension(scope.videoHeight);
                            posterMaskElement = angular.element('<div class="custom-poster-container" style="position:absolute;top:0;left:0;width:' + dimensions.width + 'px;;height:' + dimensions.height + 'px;"><img style="width: 100%;height: 100%" src="' + attrs.customPoster + '"></div>');
                            var parentStyle = window.getComputedStyle(parentDomElem);
                            if (parentStyle.position === 'static') {
                                parentDomElem.style.position = 'relative';
                            }
                            parentElem.append(posterMaskElement);
                        }
                    }
                    addCustomPoster();

                    transclude(scope.$parent, function (clone) {
                        var videoElem = clone;
                        var videoDomElem = videoElem[0];

                        scope.actions = scope.actions || {};

                        scope.actions.replay = function () {
                            videoDomElem.pause();
                            videoDomElem.currentTime = '0';
                            videoDomElem.play();
                        };

                        scope.actions.pause = function () {
                            videoDomElem.pause();
                        };

                        scope.actions.showPoster = function () {
                            addCustomPoster();
                        };

                        var dimensions = getDimension(scope.videoHeight);
                        if(dimensions !== null){
                            videoDomElem.style.width = dimensions.width + 'px';
                            videoDomElem.style.height = dimensions.height + 'px';
                        }

                        parentElem.append(videoElem);

                        function endedHandler() {
                            scope.$apply(function () {
                                scope.onEnded();
                            });
                        }
                        videoElem.on('ended', endedHandler);

                        function canplaythroughHandler(){
                            if(attrs.hasOwnProperty('customAutoplay')){
                                videoDomElem.play();
                            }
                            if (posterMaskElement) {
                                $timeout(function(){
                                    posterMaskElement.remove();
                                },1000,false)
                            }
                        }
                        videoElem.on('canplaythrough', canplaythroughHandler);
                        //preload is not supported in ios
                        if(ionic.Platform.isIOS() && attrs.hasOwnProperty('customAutoplay')){
                            videoDomElem.play();
                        }

                        scope.$on('$destroy', function () {
                            videoElem.off('canplaythrough', canplaythroughHandler);
                            videoElem.off('ended', endedHandler);
                        });
                    });
                }
            };
        }
    ]);
})(angular);

