/**
 * attrs:
 */

(function (angular,ionic) {
    'use strict';

    angular.module('znk.sat').directive('flashcardSwipeDrv', [
        '$ionicGesture', '$window', '$animate',
        function ($ionicGesture, $window, $animate) {
            return {
                scope: {
                    onCardDestroyed: '&',
                    onFlashcardSwipeRightStart: '&',
                    onFlashcardSwipeRightEnd: '&',
                    onFlashcardSwipeLeftStart: '&',
                    onFlashcardSwipeLeftEnd: '&'
                },
                link: function (scope, element) {
                    function generateTransformStyle(rotateZ,translateX,translateY){
                        return 'rotateZ(' + rotateZ + 'deg) translate3d(' + translateX + 'px,' + translateY + 'px,0px)';
                    }

                    var domElement = element[0];
                    domElement.style.transform = domElement.style['-webkit-transform'] = generateTransformStyle(0,0,0);
                    domElement.style.transition = domElement.style['-webkit-transition'] = '-webkit-transform 0.3s linear';

                    var leftOffsetWhenSwipe = $window.innerWidth + 40;
                    var topOffsetWhenSwipe = $window.innerHeight / 8;

                    var animateProm;
                    function swipeHandler(evt){
                        if(animateProm){
                            return;
                        }
                        animateProm = true;

                        var animationCss = {};
                        var swipeEndFnName;
                        switch(evt.type){
                            case 'swiperight':{
                                animationCss.transform = animationCss['-webkit-transform'] = generateTransformStyle(-10,leftOffsetWhenSwipe,-topOffsetWhenSwipe);
                                scope.onFlashcardSwipeRightStart();
                                swipeEndFnName = 'onFlashcardSwipeRightEnd';
                                break;
                            }
                            case 'swipeleft':{
                                animationCss.transform = animationCss['-webkit-transform'] = generateTransformStyle(10,-leftOffsetWhenSwipe,-topOffsetWhenSwipe);
                                scope.onFlashcardSwipeLeftStart();
                                swipeEndFnName = 'onFlashcardSwipeLeftEnd';
                                break;
                            }
                        }

                        scope.$apply(function(){
                            animateProm = $animate.animate(element,undefined,animationCss);
                            animateProm.then(function(){
                                scope.onCardDestroyed();
                                scope[swipeEndFnName]();
                                animateProm = null;
                            });
                        });

                    }
                    ionic.on('swipeleft',swipeHandler,domElement);
                    ionic.on('swiperight',swipeHandler,domElement);

                    scope.$on('$destroy',function(){
                        ionic.off('swipeleft',swipeHandler,domElement);
                        ionic.off('swiperight',swipeHandler,domElement);
                    });
                }
            };
        }
    ]);
})(angular,ionic);

