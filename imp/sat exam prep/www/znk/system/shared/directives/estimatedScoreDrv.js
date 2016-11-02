'use strict';

(function (angular) {
    angular.module('znk.sat').directive('estimatedScoreDrv', [
        'EstimatedScoreSrv', 'MobileSrv','$ionicScrollDelegate', 'EnumSrv', '$timeout', 'HintSrv', '$q',
        function (EstimatedScoreSrv, MobileSrv, $ionicScrollDelegate, EnumSrv, $timeout, HintSrv, $q) {

            var MAX_SUBJECT_SCORE = 800;

            return {
                restrict:'A',
                templateUrl: 'znk/system/shared/templates/estimatedScoreDrv.html',
                scope: {
                    viewSize: '@',
                    onGaugeClick: '&?',
                    onEstimatedScore: '&?',
                    onTotalScore: '&?'
                },
                link: function (scope, element, attrs) {

                    var isMobile = MobileSrv.isMobile();
                    var $el = angular.element(element);
                    var showTotal = (attrs.location === 'home' & isMobile) ? false : true;
                    var homePageScrollDelegate = $ionicScrollDelegate.$getByHandle('homePage');

                    var subjectProgressScore = function(estimatedScore, subjectId){
                        var subjectScore = ((estimatedScore[subjectId].min + 30)/MAX_SUBJECT_SCORE) * 100;

                        if(isNaN(subjectScore)){
                            subjectScore=0;
                        }
                        return subjectScore;
                    };

                    scope.subjectEnum = EnumSrv.subject;


                    EstimatedScoreSrv.getEstimatedScoreRanges().then(function(estimatedScore){
                        scope.estimatedScore = estimatedScore;
                        scope.onEstimatedScore( { estimatedScore : estimatedScore } );

                        scope.subjectProgress = {
                            math : subjectProgressScore(estimatedScore,scope.subjectEnum.math.enum),
                            read : subjectProgressScore(estimatedScore,scope.subjectEnum.reading.enum),
                            write : subjectProgressScore(estimatedScore,scope.subjectEnum.writing.enum)
                        };
                    });

                    if(showTotal) {
                        EstimatedScoreSrv.getEstimatedScores().then(function(estimatedScore) {

                            scope.totalScore = { score: 0, isPositive: false, show: false};

                            angular.forEach(estimatedScore, function(estimatedScoreSection) {
                                if(estimatedScoreSection.length > 1) {
                                    scope.totalScore.score += (estimatedScoreSection[estimatedScoreSection.length - 1].score -  estimatedScoreSection[0].score);
                                }
                            });

                            if(scope.totalScore.score > 0) {
                                scope.totalScore.isPositive = true;
                            }

                            if(scope.totalScore.score !== 0) {
                                scope.totalScore.show = true;
                            }

                            if(isMobile) {
                                scope.onTotalScore({ totalScore : scope.totalScore});
                            }

                        });
                    }

                    scope.viewSizes = {
                        mini: 'mini',
                        full: 'full'
                    };
                    scope.gauge =  {
                        radius: isMobile ? 35 : 45,
                        stroke: isMobile ? 2 : 3
                    };

                    if(scope.viewSize !== scope.viewSizes.mini){
                        var getHintStatusProm = HintSrv.getHintStatus(HintSrv.HOME_ESTIMATED_SCORE_PROGRESS,true);
                        var getSubjectsDeltaProm = EstimatedScoreSrv.getSubjectsDelta();
                        $q.all([getHintStatusProm,getSubjectsDeltaProm]).then(function(all){
                            scope.subjectsDelta = {};
                            var homeEstimatedScoreHintStatus = all[0] || {};
                            var subjectsDelta = all[1];
                            scope.subjectEnum.getEnumArr().forEach(function(subjectEnumObj){
                                var subjectEnum = subjectEnumObj.enum;
                                var subjectDelta = subjectsDelta[subjectEnum];
                                if(subjectDelta.delta && (!homeEstimatedScoreHintStatus[subjectEnum] || homeEstimatedScoreHintStatus[subjectEnum] !== subjectDelta.scoresNum)){
                                    homeEstimatedScoreHintStatus[subjectEnum] = subjectDelta.scoresNum;
                                    scope.subjectsDelta[subjectEnum] = subjectDelta.delta;
                                }
                            });

                            if(!angular.equals(homeEstimatedScoreHintStatus)){
                                HintSrv.setHintStatus(HintSrv.HOME_ESTIMATED_SCORE_PROGRESS,homeEstimatedScoreHintStatus);
                            }

                            $timeout(function(){
                                delete scope.subjectsDelta;
                            }, 6000);
                        });
                    }

                    if(scope.viewSize ===  scope.viewSizes.mini){
                        scope.gauge =  {
                            radius: 15,
                            stroke: 2,
                            top:  isMobile ? 120 : 208
                        };
                        $el.addClass('ng-hide');

                        homePageScrollDelegate.getScrollView().onScroll = function () {
                            if(scope.viewSize ===  scope.viewSizes.mini){
                                var top = $ionicScrollDelegate.getScrollPosition().top;
                                if(top > scope.gauge.top){
                                    if($el.hasClass('ng-hide')){
                                        $el.removeClass('ng-hide');
                                    }
                                }
                                else{
                                    if(!$el.hasClass('ng-hide')){
                                        $el.addClass('ng-hide');
                                    }
                                }
                            }
                        };
                    }
                }
            };
        }
    ]);
})(angular);
