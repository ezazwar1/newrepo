/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('homeDailyItem', [
        '$ionicScrollDelegate', 'HomeSrv', '$ionicGesture', 'HomeItemStatusEnum', 'SharedModalsSrv', 'DailySrv', '$state', '$compile', '$animate', '$window', 'MobileSrv', '$timeout', 'HintSrv', 'ExpSrv', 'EnumSrv', '$q', 'PersonalizationStatsSrv', 'SubjectEnum',
        function ($ionicScrollDelegate, HomeSrv, $ionicGesture, HomeItemStatusEnum, SharedModalsSrv, DailySrv, $state, $compile, $animate, $window, MobileSrv, $timeout, HintSrv, ExpSrv, EnumSrv, $q, PersonalizationStatsSrv, SubjectEnum) {
            return {
                templateUrl: 'znk/home/templates/homeDailyItemDrv.html',
                restrict: 'E',
                require:'homePngSequenceDrv',
                scope:{
                    positionGetter: '&position',
                    dailyGetter: '&daily',
                    index: '&index',
                    showFootPrints:'&?'
                },
                link: function (scope, element, attrs,pngSeqCtrl) {
                    var itemTransformVal = element.parent().parent().css('transform');
                    var posValuesArr = itemTransformVal.replace(/px/g,'').replace('translate3d(','').replace(')','').split(',');
                    var isMobile = MobileSrv.isMobile();
                    var dailyOrder = scope.dailyGetter().dailyOrder;
                    var leftCircleOffset = isMobile ? -40 : -95,
                        topCircleOffset = isMobile? -45 : -106,
                        radius = isMobile ? 170 : 300;

                    var pos = {
                        top: +posValuesArr[1],
                        left: +posValuesArr[0]
                    };
                    var daily = scope.dailyGetter();

                    scope.d = {};

                    scope.d.subjectNames = SubjectEnum.getEnumMap();

                    scope.d.daily = daily;

                    if((daily.status === HomeItemStatusEnum.ACTIVE.enum || daily.status === HomeItemStatusEnum.COMPLETED.enum) && angular.isDefined(daily.dailyOrder)) {
                        scope.d.bubbleStatus = {
                            flashcards: angular.isDefined(daily.flashcards) && daily.flashcards.isCompleted
                        };
                    }

                    var homePageScrollDelegate = $ionicScrollDelegate.$getByHandle('homePage');
                    function getScrollYOffset(){
                        var scrollPosition = homePageScrollDelegate.getScrollPosition();
                        return scrollPosition ?  scrollPosition.top : 0;
                    }

                    function setDailyStatus() {
                        scope.d.row1 = scope.d.row2 = '';
                        pngSeqCtrl.resetPngSeq();

                        switch (daily.status) {
                            case HomeItemStatusEnum.NEW.enum:
                                scope.d.row1 = 'WORKOUT <span>' + daily.dailyOrder + '</span>';
                                break;
                            case HomeItemStatusEnum.ACTIVE.enum:
                                if (angular.isUndefined(daily.dailyOrder)) {
                                    element.addClass('diagnostic-test');
                                    scope.d.row1 = 'DIAGNOSTIC';
                                    scope.d.row2 = 'TEST';
                                }
                                else {
                                    scope.d.row1 = activeDailyRow1Title();
                                    scope.d.row2 = 'WORKOUT ' + daily.dailyOrder;
                                }


                                if(dailyOrder === 1 || dailyOrder % 5 === 0 ){
                                    transparentCircleModal(radius, dailyOrder);
                                }
                                else{
                                    playDailyAnimation();
                                }

                                if(dailyOrder === 3){//@todo(igor) this should be triggered in home ctrl...
                                    $timeout(function(){
                                        HintSrv.triggerTestsHint();
                                    },1000);
                                }

                                element.addClass('started');
                                break;
                            case HomeItemStatusEnum.COMPLETED.enum:
                                element.addClass('completed');
                                scope.d.row1 = '<i class="correct-answer-white"></i>';

                                if (angular.isUndefined(daily.dailyOrder)) {
                                    scope.d.row2 = 'DIAGNOSTIC<br>TEST';
                                    element.addClass('diagnostic-test');
                                }
                                else {
                                    scope.d.row2 = 'WORKOUT ' + daily.dailyOrder;
                                }
                                break;
                            case HomeItemStatusEnum.COMING_SOON.enum:
                                scope.d.row1 = 'Coming Soon';
                                element.addClass('coming-soon');
                                break;
                            default :
                                scope.d.row1 = 'DAILY <span>' + daily.dailyOrder + '</span>';

                        }
                    }

                    setDailyStatus();

                    function clickAction() {
                        pngSeqCtrl.stopPngSeq();

                        if (clickAction.isModalOpen) {
                            return;
                        }

                        if (angular.isUndefined(daily.dailyOrder)) {
                            $state.go('app.diagnostic');
                            return;
                        }

                        if (attrs.disabled) {
                            SharedModalsSrv.showIapModal();
                            return;
                        }

                        if (daily.status === HomeItemStatusEnum.ACTIVE.enum || daily.status === HomeItemStatusEnum.COMPLETED.enum) {
                            var itemPos = {
                                top: pos.top - getScrollYOffset(),
                                left: pos.left

                            };
                            var dailyDetailsModalInstance = HomeSrv.showDailyDetailsModal(daily, itemPos);
                            dailyDetailsModalInstance.promise.then(function (flashcardModalInstance) {
                                if (flashcardModalInstance && flashcardModalInstance !== 'closed') {
                                    flashcardModalInstance.promise.then(function () {
                                        DailySrv.isDailyFlashcardsCompleted(daily.dailyOrder).then(function (isCompleted) {
                                            daily.flashcards.isCompleted = isCompleted;
                                            scope.d.bubbleStatus['flashcards'] = isCompleted;
                                        });
                                        pngSeqCtrl.continuePngSeq();
                                    });
                                }else{
                                    pngSeqCtrl.continuePngSeq();
                                }

                                clickAction.isModalOpen = false;

                            });
                        }
                    }

                    function transparentCircleModal(radius, dailyNum){
                        var isWeakestSubjectAnimation = dailyNum % 5 === 0;
                        var hintStatusProm = HintSrv.getHintStatusByKey('homeTransparentCircleHint', dailyNum);
                        var weakestSubjectProm = PersonalizationStatsSrv.getWeakestSubject();
                        var dailyDomPos =  element[0].getBoundingClientRect();
                        var wrapClass = isWeakestSubjectAnimation ? 'transparent-circle-hint-wrapper' : 'transparent-circle-hint-wrapper transparent-background'; //todo (kosta) remove the workout1 animation from the modal

                        $q.all([hintStatusProm, weakestSubjectProm]).then(function(result){
                            var alreadyShown = result[0];
                            var weakestSubjectId = result[1];
                            var pngSeqOptions = isWeakestSubjectAnimation ? pngSeqCtrl.getWeakestSubjectPngSeqSettings(scope.d.subjectNames[weakestSubjectId]) : pngSeqCtrl.getWorkout1PngSeqSettings();
                            var text = isWeakestSubjectAnimation ? "Let's boost your " +  scope.d.subjectNames[weakestSubjectId] + " score!" : '';

                            if(!alreadyShown){
                                var disableAllClicksModalProm = pngSeqCtrl.disableAllClicks();
                                var showFootPrintsProm = dailyNum === 1 ? scope.showFootPrints()(dailyNum) : null;
                                $q.when(showFootPrintsProm).then(function(){
                                    HintSrv.triggerHomeCircleTransparentHint(dailyDomPos.top + topCircleOffset - getScrollYOffset(),dailyDomPos.left + leftCircleOffset, radius, '', wrapClass, dailyNum, pngSeqOptions)
                                        .then(function(transparentCircleText){
                                            $timeout(function(){
                                                transparentCircleText.setText(text);
                                            },4000);
                                        });
                                    disableAllClicksModalProm.close();
                                });
                            }else{
                                playDailyAnimation();
                            }
                        });
                    }

                    function playDailyAnimation(){
                        if(!daily.locked){

                            ExpSrv.getGamificationObj().then(function(gamificationObj){
                                var titleName = (gamificationObj.level && gamificationObj.level.name) ? gamificationObj.level.name : 'Newbie';
                                pngSeqCtrl.playPngSequence(pos.left, titleName);
                            });
                        }
                    }

                    function activeDailyRow1Title(){
                        var requiredParts = ['tutorial', 'drill', 'game'];
                        var title = 'START';

                        requiredParts.forEach(function(part){
                            if(daily[part].isCompleted){
                                title = 'CONTINUE';
                            }
                        });
                        return title;
                    }

                    var touchGesture = $ionicGesture.on('tap',clickAction,element);

                    scope.$on('$destroy',function(){
                        touchGesture.off('touch',clickAction);
                        pngSeqCtrl.closeTimeout();
                    });
                }
            };
        }
    ]);
})(angular);

