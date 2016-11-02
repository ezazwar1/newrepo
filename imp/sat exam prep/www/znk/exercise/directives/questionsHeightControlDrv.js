/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('questionsHeightControlDrv', [
        function () {
            return {
                controller: [
                    '$element', '$ionicSlideBoxDelegate', '$scope', '$ionicScrollDelegate',
                    function ($element, $ionicSlideBoxDelegate, $scope, $ionicScrollDelegate) {
                        var self = this;
                        self.levelEnum = {
                            BOTTOM: 1,
                            MIDDLE: 2,
                            TOP: 3
                        };

                        self.levelToHeightMap = {};
                        self.levelToHeightMap[self.levelEnum.BOTTOM] = 'calc(100% - 175px)';
                        self.levelToHeightMap[self.levelEnum.MIDDLE] = '40%';
                        self.levelToHeightMap[self.levelEnum.TOP] = '0px';

                        var articlesHeightLevelMap = {};
                        var articleMaskHtmlElement = $element[0].querySelector('[article-mask-control-drv]');
                        var domElement = $element[0];


                        function changeArticleHeightLevel(levelOffset, articleId){
                            var newArticleLevel = self.getArticleLevel(articleId) + levelOffset;

                            if(newArticleLevel >= self.levelEnum.BOTTOM && newArticleLevel <= self.levelEnum.TOP){
                                setArticleHeight(articleId,newArticleLevel);
                            }
                        }

                        function setArticleHeight(articleId,level){
                            var heightPropValue = self.levelToHeightMap[level];
                            var articleWrapperHtmlElements = domElement.querySelectorAll('ion-slide .article-wrapper');
                            var currQuestionIndex = $ionicSlideBoxDelegate.currentIndex();
                            var elementsToSet = [articleMaskHtmlElement,articleWrapperHtmlElements[currQuestionIndex === 0 ? 0 : 1]];
                            var questions = $scope.d.questionsWithAnswers;

                            self.setScrollState(level,currQuestionIndex);

                            if(questions[currQuestionIndex - 1 ] && questions[currQuestionIndex - 1 ].groupDataId === articleId){
                                elementsToSet.push(articleWrapperHtmlElements[0]);
                                self.setScrollState(level,currQuestionIndex - 1);
                            }

                            if(questions[currQuestionIndex + 1 ] && questions[currQuestionIndex + 1 ].groupDataId === articleId){
                                elementsToSet.push(articleWrapperHtmlElements[articleWrapperHtmlElements.length - 1]);
                                self.setScrollState(level,currQuestionIndex + 1);
                            }

                            elementsToSet.forEach(function(domElement){
                                domElement.style.height = heightPropValue;
                            });

                            articlesHeightLevelMap[articleId] = level;
                        }

                        self.increaseArticleHeightLevel = changeArticleHeightLevel.bind(self,1);

                        self.decreaseArticleHeightLevel = changeArticleHeightLevel.bind(self,-1);

                        self.getArticleLevel = function(articleId){
                            if(!articlesHeightLevelMap[articleId]){
                                articlesHeightLevelMap[articleId] = self.levelEnum.MIDDLE;
                            }
                            return articlesHeightLevelMap[articleId];
                        };

                        self.getArticleHeight = function(articleId){
                            return self.levelToHeightMap[self.getArticleLevel(articleId)];
                        };
                        //question scrolling should be enabled only if it occupy full height (article in level TOP)
                        self.setScrollState = function(level,questionIndex){
                            var scrollDelegate = $ionicScrollDelegate.$getByHandle('question-scroll-' + questionIndex);
                            scrollDelegate.freezeScroll(level !== self.levelEnum.TOP);
                        };
                    }],
                link: function (scope, element, attrs) {
                }
            };
        }
    ]);
})(angular);

