/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('homePngSequenceDrv', ['$window', '$compile', '$timeout', '$q', 'MobileSrv', 'ZnkModalSrv', 'HomePngSeqSrv',

        function ($window, $compile, $timeout, $q, MobileSrv, ZnkModalSrv, HomePngSeqSrv) {
            return {
                controller:['$scope', '$element', function($scope, $element){
                    var _this = this;
                    var deviceWidth = $window.innerWidth;
                    var activeDailyAnimScope;
                    var timeout;
                    var classToAdd;
                    var pngSequenceElem;
                    var classesToRemove = HomePngSeqSrv.classesToRemove();

                    this.getWorkout1PngSeqSettings = HomePngSeqSrv.getWorkout1PngSeqSettings;
                    this.getWeakestSubjectPngSeqSettings = HomePngSeqSrv.getWeakestSubjectPngSeqSettings;

                    var disablAllClicksOptions = {
                        wrapperClass: 'disable-all-clicks',
                        dontCloseOnBackdropTouch:true,
                        hideBackdrop: true
                    };

                    this.disableAllClicks = ZnkModalSrv.singletonModalFn(disablAllClicksOptions);

                    this.resetPngSeq = function(){
                        if (activeDailyAnimScope) {
                            activeDailyAnimScope.$destroy();
                            angular.element(document.querySelector('png-sequence')).remove();
                            activeDailyAnimScope = null;
                            $timeout.cancel(timeout);
                        }
                    };

                    this.playPngSequence = function(dailyPosition, titleName){
                        if(!titleName){
                            return;
                        }
                        activeDailyAnimScope = $scope.$new(true);
                        playDailyAnimation(dailyPosition, titleName);
                    };

                    this.stopPngSeq = function(){
                        if(activeDailyAnimScope && activeDailyAnimScope.actions && activeDailyAnimScope.actions.reset){
                            _this.closeTimeout();
                            activeDailyAnimScope.actions.reset();
                        }
                    }

                    this.continuePngSeq = function(){
                        if(activeDailyAnimScope  && activeDailyAnimScope.switchAnimation){
                            $timeout(function () {
                                activeDailyAnimScope.switchAnimation();
                            },0);
                        }
                    }

                    function playDailyAnimation(dailyPosition, titleName){
                        var right = dailyPosition >= (2*deviceWidth)/3 - 20 ;
                        var left =  dailyPosition <= deviceWidth/3 -20;
                        var randomPosition = !right && !left;

                        function setAnimationSettings() {
                            var randomPath = titleName + (Math.floor(Math.random() * 2)  + 1);  // e.g  Newbie1
                            activeDailyAnimScope.startImgIndex = 0;
                            activeDailyAnimScope.endImgIndex = HomePngSeqSrv.numberOfImages[randomPath];
                            activeDailyAnimScope.imgArr = 'assets/img/homeRaccoonAnimation/' + randomPath + '/';
                            if(!activeDailyAnimScope.endImgIndex){
                                return;
                            }

                            if (randomPosition) {
                                classToAdd = Math.floor(Math.random()*2) ? 'left-' : 'right-';
                            } else {
                                classToAdd = right ? 'left-' : 'right-';
                            }
                            classToAdd += randomPath.replace(/\s/g,"-");
                        }

                        appendPngSeqElement();

                        // the first play is without delay.
                        var firstPlay = true;
                        activeDailyAnimScope.switchAnimation = function () {
                            pngSequenceElem.removeClass(classesToRemove);
                            setAnimationSettings();
                            pngSequenceElem.addClass(classToAdd);

                            var delay = firstPlay ? 0 : Math.round(Math.random() * 6) + 6;
                            timeout = $timeout(function () {
                                if(activeDailyAnimScope.actions && activeDailyAnimScope.actions.play){
                                    activeDailyAnimScope.actions.setPngSeqSettings();
                                    activeDailyAnimScope.actions.play();
                                    firstPlay = false;
                                }
                            }, delay * 1000);
                        };

                        $timeout(function () {
                            activeDailyAnimScope.switchAnimation();
                        },0);
                    }

                    function appendPngSeqElement(){
                        pngSequenceElem = angular.element('<png-sequence style= "position:relative;" ' +
                        'img-data="{{imgArr}}" ' +
                        'loop="false" ' +
                        'speed="50" ' +
                        'start-index="{{startImgIndex}}" ' +
                        'end-index="{{endImgIndex}}" ' +
                        'on-ended="switchAnimation()" ' +
                        'actions="actions">' +
                        '</png-sequence>');
                        $element.append(pngSequenceElem);
                        $compile(pngSequenceElem)(activeDailyAnimScope);
                    }

                    _this.closeTimeout = function(){
                        $timeout.cancel(timeout);
                    }
                }]
            };
        }
    ]);
})(angular);

