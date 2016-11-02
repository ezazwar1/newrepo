
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('writtenSlnHintModalIconDrv', [
        '$ionicSlideBoxDelegate','MobileSrv','$timeout',
        function ($ionicSlideBoxDelegate,MobileSrv,$timeout) {
            return {
                restrict:'A',
                link:function(scope, element){
                    var domElement = element[0];
                    var isMobile = MobileSrv.isMobile();

                    var allSlidesDomElem = document.querySelectorAll('ion-slide');
                    if(!allSlidesDomElem.length){
                        return;
                    }

                    var currIndex = $ionicSlideBoxDelegate.currentIndex();
                    if(!allSlidesDomElem[currIndex]){
                        return;
                    }

                    var solutionIconWrappers = allSlidesDomElem[currIndex].querySelectorAll('.answer-solution-icon-wrapper');
                    var textBox = angular.element(domElement.querySelector('.text-box'));
                    var hintSolutionIcon;
                    var solutionIcon;
                    var showHint = false;

                    hintSolutionIcon = angular.element(domElement.querySelector(isMobile ? '.icon-circle-blue' : '.icon-circle-white'));

                    var solutionIconWrapperDomElem;
                    for(var i in solutionIconWrappers) {
                        solutionIconWrapperDomElem = solutionIconWrappers[i];

                        if((typeof solutionIconWrapperDomElem) !== 'object') {
                            continue;
                        }

                        if (window.getComputedStyle(solutionIconWrapperDomElem).visibility === 'visible') {
                            showHint = true;
                            var iconPositionName = isMobile ? '.circle-with-icon' : '.answer-solution-icon';
                            var solutionIconPosition = solutionIconWrapperDomElem.querySelector(iconPositionName);
                            var isFreeTextAnswer = solutionIconPosition === null ? true : false;

                            var topGridInquestionOffset = 0;
                            var leftGridInquestionOffset = 0;
                            var topOffsetSolutionIcon = 0, leftOffsetsolutionIcon = 0 ;
                            var leftTextBoxOffset, topTextBoxOffset;

                            if(isFreeTextAnswer) {
                                solutionIconPosition = solutionIconWrapperDomElem.querySelector('.answer-solution-white-icon').getBoundingClientRect();
                                leftGridInquestionOffset = -5;
                                topGridInquestionOffset = -2;
                            }else{
                                solutionIconPosition = solutionIconWrapperDomElem.querySelector(iconPositionName).getBoundingClientRect();
                            }


                            solutionIcon = angular.element(solutionIconWrapperDomElem);

                            if(isMobile){
                                leftTextBoxOffset =  -281;
                                topTextBoxOffset = + 5;
                            }
                            else {
                                leftOffsetsolutionIcon = -10;
                                topOffsetSolutionIcon = -9;
                                leftTextBoxOffset = 100;
                                topTextBoxOffset = 17;
                            }

                            var top = solutionIconPosition.top + topOffsetSolutionIcon + topGridInquestionOffset;
                            var left = solutionIconPosition.left + leftOffsetsolutionIcon + leftGridInquestionOffset;

                            hintSolutionIcon.css('top',top + 'px');
                            hintSolutionIcon.css('left',left + 'px');
                            textBox.css('top', top + topTextBoxOffset + 'px');
                            textBox.css('left', left + leftTextBoxOffset + 'px');
                            break;
                        }
                    }
                    if(!showHint){
                        scope.close();
                    }
                    scope.openWrittenSolution = function(){
                        scope.close();
                        //without timeout there is an "$apply already in progress" error
                        $timeout(function(){
                            angular.element(solutionIconWrapperDomElem).triggerHandler('click');
                        });
                    };

                }

            };
        }
    ]);
})(angular);

