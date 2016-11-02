(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('HintSrv', [
        'StorageSrv', '$rootScope', '$q', 'ZnkModalSrv', 'GoBackHardwareSrv', 'SharedModalsSrv', 'MobileSrv',
        function (StorageSrv, $rootScope, $q, ZnkModalSrv, GoBackHardwareSrv, SharedModalsSrv, MobileSrv) {
            var HintSrv = {};
            var isMobile = MobileSrv.isMobile();

            HintSrv.WRITTEN_SLN_HINT = 'writtenSlnHint';
            HintSrv.QUESTION_TOUR_HINT = 'questionTourHint';
            HintSrv.SUMMARY_HINT = 'summaryHint';
            HintSrv.TRANSPARENT_CIRCLE_HINT = 'homeTransparentCircleHint';
            HintSrv.DIAGNOSTIC_SUMMARY_HINT = 'diagnosticSummaryHint';
            HintSrv.TESTS_HINT = 'testsHint';
            HintSrv.HOME_ESTIMATED_SCORE_PROGRESS = 'homeEstimatedScoreProgress';
            HintSrv.APP_RATE = 'appRate';

            var hintPath = StorageSrv.appUserSpacePath.concat(['hint']);

            function getHints(){
                return StorageSrv.get(hintPath).then(function(hint){
                    var defaultValues = {
                        hintsStatus:{}
                    };
                    for(var prop in defaultValues){
                        if(angular.isUndefined(hint[prop])){
                            hint[prop] = defaultValues[prop];
                        }
                    }

                    return hint;
                });
            }

            var childScope = $rootScope.$new(true);
            childScope.$on('auth:logout',function(){//@todo(igor) we need to make general solution for this case
                getHints.prom = null;
            });

            HintSrv.saveHints = function(newHint){
                return StorageSrv.set(hintPath,newHint);
            };

            HintSrv.getHintStatus = function(hintArr,notAsBoolean){
                if(angular.isUndefined(hintArr)){
                    return;
                }

                return getHints().then(function(hints){
                    var hintsStatus = hints.hintsStatus;
                    if(angular.isArray(hintArr)){
                        return hintArr.map(function(hintName){
                            return !!hintsStatus[hintName];
                        });
                    }else{
                        return notAsBoolean ? hintsStatus[hintArr] : !!hintsStatus[hintArr];
                    }
                });
            };

            HintSrv.setHintStatus = function(hintName,status){
                return getHints().then(function(hints){
                    hints.hintsStatus[hintName] = status;
                    return HintSrv.saveHints(hints);
                });
            };

            HintSrv.triggerHint = function(hintName, action, setStatusAccordingToActionResult){
                return getHints().then(function(hints){
                        var hintsStatus = hints.hintsStatus;
                        if(!hintsStatus[hintName]){
                            action = action || HintSrv[hintName + 'Action'];
                            return $q.when(action()).then(function(res){
                                if(setStatusAccordingToActionResult){
                                    hintsStatus[hintName] = !!res;
                                }else{
                                    hintsStatus[hintName] = true;
                                }
                                HintSrv.saveHints(hints);
                                return res;
                            });
                        }
                        return $q.when(null);
                    });
            };

            var showWrittenSlnHintOptions = {
                templateUrl: 'znk/system/shared/templates/writtenSlnHintModal.html',
                wrapperClass: 'written-sln-hint-modal show-animation-v2',
                dontCentralize: false,
                showCloseBtn: true
            };
            HintSrv.writtenSlnHintAction = ZnkModalSrv.singletonModalFn(showWrittenSlnHintOptions);
            HintSrv.triggerWrittenSlnHint = HintSrv.triggerHint.bind(HintSrv,HintSrv.WRITTEN_SLN_HINT);

            var showDiagnosticSummaryHintOptions = {
                dontCentralize: true,
                templateUrl: 'znk/diagnostic/templates/summaryIntro.html',
                wrapperClass: 'base-video-tour-hint-modal diagnostic-summary-intro',
                hideBackdrop: true,
                dontCloseOnBackdropTouch: true
            };
            HintSrv.diagnosticSummaryHintAction = ZnkModalSrv.singletonModalFn(showDiagnosticSummaryHintOptions);
            HintSrv.triggerDiagnosticSummaryHint = HintSrv.triggerHint.bind(HintSrv,HintSrv.DIAGNOSTIC_SUMMARY_HINT);

            var showSummaryHintOptions = {
                templateUrl: 'znk/system/shared/templates/transparentCircleHintModal.html',
                wrapperClass: 'summary-hint-modal show-animation-v2',
                ctrl: 'transparentCircleHintCtrl',
                ctrlAs:'ctrl',
                resolve:{
                    config: {
                        focusedItemClassName: '.summary-bottom-row .btn.float-left',
                        circleRadius: isMobile ? 165 : 245,
                        text: 'Tap here to review your answers',
                        focusedItemleftOffset: isMobile ? -11 : -25,
                        focusedItemTopOffset: isMobile ? -63 : -103,
                        arrowLeftOffset: isMobile ? 65 : 97,
                        arrowTopOffset: isMobile ? - 70: -71
                    }
                },
                dontCentralize: false,
                showCloseBtn: true
            };
            HintSrv.summaryHintAction = ZnkModalSrv.singletonModalFn(showSummaryHintOptions);//@todo(igor) we should not expose this function
            HintSrv.triggerSummaryHint = HintSrv.triggerHint.bind(HintSrv,HintSrv.SUMMARY_HINT);

            var showTestsHintOptions = {
                templateUrl: 'znk/system/shared/templates/transparentCircleHintModal.html',
                wrapperClass: 'tests-hint-modal show-animation-v2',
                ctrl: 'transparentCircleHintCtrl',
                ctrlAs:'ctrl',
                resolve:{
                    config: {
                        focusedItemClassName: '.button-clear.btn-with-text',
                        circleRadius: 100,
                        text: 'Whenever you’re ready, practice with a full exam',
                        focusedItemleftOffset: -20,
                        focusedItemTopOffset: -5,
                        arrowLeftOffset: 30,
                        arrowTopOffset: 45
                    }
                },
                dontCentralize: false,
                showCloseBtn: true
            };
            HintSrv.testsHintAction = ZnkModalSrv.singletonModalFn(showTestsHintOptions);
            HintSrv.triggerTestsHint = HintSrv.triggerHint.bind(HintSrv,HintSrv.TESTS_HINT);

            function _baseVideoTourAction(config){
                config = config || {};

                var propToWrapASUrl = ['videoEndedBg'];
                propToWrapASUrl.forEach(function(mapName){
                    for(var key in config[mapName]){
                        config[mapName][key] = 'url("' + config[mapName][key] + '")';
                    }
                });

                var baseVideoTourHintModalOptions = {
                    templateUrl: 'znk/system/shared/templates/baseVideoTourHintModal.html',
                    wrapperClass: 'base-video-tour-hint-modal',
                    showCloseBtn: true,
                    ctrl: 'BaseVideoTourHintModalCtrl',
                    ctrlAs: 'baseVideoTourCtrl',
                    resolve:{
                        config: config
                    }
                };
                return ZnkModalSrv.singletonModalFn(angular.copy(baseVideoTourHintModalOptions));
            }

            var questionTourConfig = {
                videoSrc:{
                    mobileUrl: 'assets/videos/question-tour-mobile.mp4',
                    tabletUrl: 'assets/videos/question-tour.mp4'
                },
                closeModalBtnTitle: 'GOT IT',
                videoEndedBg: {
                    mobileUrl: 'assets/img/bg/question-tour-ended-mobile.png',
                    tabletUrl: 'assets/img/bg/question-tour-ended.png'
                }
            };
            HintSrv.questionTourHintAction = _baseVideoTourAction(questionTourConfig);
            HintSrv.triggerQuestionTournHint = HintSrv.triggerHint.bind(HintSrv,HintSrv.QUESTION_TOUR_HINT);

            HintSrv.triggerHintByKey = function(hintName, hintKey){
                return getHints()
                    .then(function(hints){
                        var hintsStatus = hints.hintsStatus;
                        if(hintsStatus[hintName] !== hintKey){
                            hintsStatus[hintName] = hintKey;
                            HintSrv.saveHints(hints);
                            return HintSrv[hintName + 'Action']();
                        }
                    });
            };

            HintSrv.getHintStatusByKey = function(hintName, hintKey){
                if(angular.isUndefined(hintName)){
                    return;
                }

                return getHints()
                    .then(function(hints){
                        var hintsStatus = hints.hintsStatus;
                        return hintsStatus[hintName] === hintKey;
                    });
            };

            HintSrv.triggerHomeCircleTransparentHint = function triggerHomeCircleTransparentHint(top, left, radius, text, wrapClass, hintKey, pngSeqOptions){
                HintSrv.homeTransparentCircleHintAction = SharedModalsSrv.showHintModal.bind(HintSrv,top, left, radius, text, wrapClass, pngSeqOptions);
                return HintSrv.triggerHintByKey(HintSrv.TRANSPARENT_CIRCLE_HINT, hintKey);
            };

            return HintSrv;
        }
    ]);
})(angular);


