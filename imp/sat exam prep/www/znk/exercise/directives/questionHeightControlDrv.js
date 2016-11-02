/**
 * attrs:
 */

(function (angular,ionic) {
    'use strict';

    angular.module('znk.sat').directive('questionHeightControlDrv', [
        'MobileSrv',
        function (MobileSrv) {
            return {
                require: ['^questionDrv','^questionsHeightControlDrv'],
                priority: 1000,
                link: function (scope, element, attrs, ctrls) {
                    if(!MobileSrv.isMobile()){
                        return;
                    }
                    var questionDrvCtrl = ctrls[0],
                        questionsHeightControlDrvCtrl = ctrls[1],
                        hasArticle = !!questionDrvCtrl.question.groupDataId,
                        domElement = element[0],
                        articleWrapperDomElement = domElement.parentElement.querySelector('.article-wrapper');

                    if(hasArticle){
                        var articleCurrHeight = questionsHeightControlDrvCtrl.getArticleHeight(questionDrvCtrl.question.groupDataId);
                        if(angular.isDefined(articleCurrHeight)){
                            articleWrapperDomElement.style.height = articleCurrHeight;
                        }
                        var articleHeightLEvel = questionsHeightControlDrvCtrl.getArticleLevel(questionDrvCtrl.question.groupDataId);
                        questionsHeightControlDrvCtrl.setScrollState(articleHeightLEvel,questionDrvCtrl.question.__index);
                    }

                    var swipeHandler;
                    if(hasArticle){
                        swipeHandler = function(evt){
                            if(evt.gesture.direction === ionic.Gestures.DIRECTION_UP){
                                questionsHeightControlDrvCtrl.increaseArticleHeightLevel(questionDrvCtrl.question.groupDataId);
                                return;
                            }

                            if(evt.gesture.direction === ionic.Gestures.DIRECTION_DOWN){
                                questionsHeightControlDrvCtrl.decreaseArticleHeightLevel(questionDrvCtrl.question.groupDataId);
                            }
                        };
                        ionic.on('swipe',swipeHandler,element[0]);
                    }

                    scope.$on('$destroy',function(){
                        ionic.off('swipe',swipeHandler,element[0]);
                    });
                }
            };
        }
    ]);
})(angular,ionic);

