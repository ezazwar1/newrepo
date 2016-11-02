/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('articleMaskControlDrv', [
        '$timeout', '$compile', 'MobileSrv',
        function ($timeout, $compile, MobileSrv) {
            return {
                template: '<div class="article-mask-control-drv"></div>',
                require: '^questionsHeightControlDrv',
                replace: true,
                scope: {
                    questionsGetter: '&questions',
                    activeSlide: '='
                },
                link: function (scope, element, attrs, questionsHeightControlDrvCtrl) {
                    var htmlElement = element[0];
                    var $parent = element.parent();
                    var htmlParent = $parent[0];
                    var articlesData = {};
                    var ARTICLE_ID_ATTR = 'article-id';
                    var articleChildScope;
                    var articleEdgesMap;

                    function initArticlesVitalData(){
                        articlesData = [];
                        articleEdgesMap = {};

                        var questions = scope.questionsGetter();
                        questions.forEach(function(question,index){
                            var questionArticle = question.__article;
                            var prevArticleEdgeObj;
                            var prevIndex = index -1;
                            if(questionArticle){
                                var prevArticleData = articlesData[articlesData.length - 1];
                                if(prevArticleData && prevArticleData.article.id === questionArticle.id){
                                    prevArticleData.end = index;
                                }else{
                                    if(index !== 0){
                                        var lastArticle = articlesData[articlesData.length -1];
                                        if(lastArticle && lastArticle.end === prevIndex){
                                            prevArticleEdgeObj = articleEdgesMap[prevIndex];
                                            if(!prevArticleEdgeObj){
                                                prevArticleEdgeObj = {};
                                                articleEdgesMap[prevIndex] = prevArticleEdgeObj;
                                            }
                                            prevArticleEdgeObj.hideOnSwipeLeft = true;
                                        }

                                        var currentArticelEdgeObj = articleEdgesMap[index];
                                        if(!currentArticelEdgeObj){
                                            currentArticelEdgeObj = {};
                                            articleEdgesMap[index] = currentArticelEdgeObj;
                                        }

                                        currentArticelEdgeObj.hideOnSwipeRight = true;
                                    }

                                    articlesData.push({
                                        article: questionArticle,
                                        start: index,
                                        end: index
                                    });
                                }
                            }else{
                                var lastArticleData = articlesData[articlesData.length -1];
                                if(lastArticleData && lastArticleData.end === prevIndex){
                                    prevArticleEdgeObj = articleEdgesMap[prevIndex];
                                    if(!prevArticleEdgeObj){
                                        prevArticleEdgeObj = {};
                                        articleEdgesMap[prevIndex] = prevArticleEdgeObj;
                                    }
                                    prevArticleEdgeObj.hideOnSwipeLeft= true;
                                }
                            }
                        });
                    }

                    function getArticleEdges(slideNum){
                        return articleEdgesMap[slideNum];
                    }

                    function getTranslateX(elem){
                        var TRANSLATE_X_REGEX = /^translate\((.*)px,.*$/;
                        var transform = elem.style['-webkit-transform'] || elem.style.transform;
                        var match = transform.match(TRANSLATE_X_REGEX);
                        return match ? +match[1] : null;
                    }

                    function getArticleBySlideNum(slideNum){
                        for(var i in articlesData){
                            var articleData = articlesData[i];
                            if(slideNum <= articleData.end){
                                return articleData.start <= slideNum ? articleData.article : {id: ''};
                            }
                        }
                        return  {id: ''};
                    }

                    function destroyArticle(){
                        if(articleChildScope){
                            articleChildScope.$destroy();
                            articleChildScope = null;
                        }
                        element.empty();
                    }

                    function buildArticle(article){
                        element.attr(ARTICLE_ID_ATTR,article.id);

                        htmlElement.style.display = 'none';

                        destroyArticle();

                        if(!article.content){
                            return;
                        }

                        articleChildScope = scope.$new();
                        articleChildScope.article = article;

                        var $newArticle = $compile('<div article-drv content="article.content"></div>')(articleChildScope);

                        if(MobileSrv.isMobile()){
                            var articleHeight = questionsHeightControlDrvCtrl.getArticleHeight(article.id);
                            if(angular.isDefined(articleHeight)){
                                element[0].style.height = articleHeight;
                            }
                        }
                        element.append($newArticle);
                        //wait for the slide animation to end
                        $timeout(function(){
                            htmlElement.style.display = 'block';
                        },300);
                    }

                    var touchEndMouseUpHandler;
                    function addMoveWatchers(hideOnSwipeLeft,hideOnSwipeRight){
                        if(touchEndMouseUpHandler){
                            touchEndMouseUpHandler();
                        }

                        var slide = htmlParent.querySelectorAll('ion-slide')[scope.activeSlide];

                        var slideInitTranslateX = 0;
                        function mouseTouchStartHandler(evt){
                            if(evt.type === 'touchstart'){
                                slide.addEventListener('touchmove',touchMouseMoveHandler);
                                slide.addEventListener('touchend',touchEndMouseUpHandler);
                            }else{
                                slide.addEventListener('mousemove',touchMouseMoveHandler);
                                slide.addEventListener('mouseup',touchEndMouseUpHandler);
                            }
                        }

                        function touchMouseMoveHandler(){
                            var currTranslateX = getTranslateX(slide);

                            if(currTranslateX === slideInitTranslateX){
                                return;
                            }

                            if(currTranslateX > slideInitTranslateX){
                                htmlElement.style.display = hideOnSwipeRight ? 'none' : 'block';
                            }else{
                                htmlElement.style.display = hideOnSwipeLeft ? 'none' : 'block';
                            }
                        }

                        touchEndMouseUpHandler = function(){
                            slide.removeEventListener('mousedown',mouseTouchStartHandler);
                            slide.removeEventListener('touchstart',mouseTouchStartHandler);
                            slide.removeEventListener('touchmove',touchMouseMoveHandler);
                            slide.removeEventListener('touchend',touchEndMouseUpHandler);
                            slide.removeEventListener('mousemove',touchMouseMoveHandler);
                            slide.removeEventListener('mouseup',touchEndMouseUpHandler);
                        };

                        slide.addEventListener('mousedown',mouseTouchStartHandler);
                        slide.addEventListener('touchstart',mouseTouchStartHandler);
                    }

                    function addActiveArticleWatch(){
                        scope.$watch('activeSlide',function(newActiveSlideNum){
                            if(angular.isDefined(newActiveSlideNum)){
                                var prevArticleId = element.attr(ARTICLE_ID_ATTR);
                                var currentArticle = getArticleBySlideNum(newActiveSlideNum);
                                if(angular.isUndefined(prevArticleId) || prevArticleId !== '' + currentArticle.id){
                                    buildArticle(currentArticle);
                                    if(currentArticle.id){
                                        var currentArticleEdges = getArticleEdges(newActiveSlideNum);
                                        if(currentArticleEdges){
                                            addMoveWatchers(currentArticleEdges.hideOnSwipeLeft,currentArticleEdges.hideOnSwipeRight);
                                        }
                                    }
                                }else{
                                    if(currentArticle.id === ''){
                                        destroyArticle();
                                    }
                                }
                            }
                        });
                    }

                    var questionsWatchDestroyer = scope.$watch('questionsGetter().length',function(newQuestionsLength){
                        if(angular.isDefined(newQuestionsLength)){
                            questionsWatchDestroyer();

                            if(newQuestionsLength !== 0){
                                initArticlesVitalData();
                                addActiveArticleWatch();
                            }
                        }
                    });
                }
            };
        }
    ]);
})(angular);

