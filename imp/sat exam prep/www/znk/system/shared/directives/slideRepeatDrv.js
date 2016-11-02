/**
 * attrs:
 *  active-slide
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('slideRepeatDrv', [
        '$timeout', '$ionicSlideBoxDelegate', '$compile',
        function ($timeout, $ionicSlideBoxDelegate, $compile) {
            return {
                priority: 1000,
                transclude: 'element',
                link: function (scope, element, attrs, ctrl, transclude) {
                    var ITEM_IN_ITEMS_REGEX = /^(.*) in (.*)$/;
                    var match = attrs.slideRepeatDrv.match(ITEM_IN_ITEMS_REGEX);
                    var itemProp = match[1];
                    var itemsProp = match[2];
                    var $parent = element.parent();
                    var items;
                    var slidesArr = [];

                    function addEmptySlide(itemIndex) {
                        var childScope = scope.$new();
                        childScope[itemProp] = items[itemIndex];
                        childScope.$index = itemIndex;
                        var $emptySlider = angular.element('<ion-slide/>');
                        var emptySliderHtmlElement = $emptySlider[0];

                        //wait for the ion-slide to set the left value and then override it
                        $timeout(function () {
                            $parent[0].style.width = 768 * 3 + 'px';
                        });
                        emptySliderHtmlElement.style.display = 'none';
                        emptySliderHtmlElement.style['max-width'] = '0';
                        emptySliderHtmlElement.style.position = 'absolute';
                        $parent.append($emptySlider);
                        $compile($emptySlider)(childScope);
                        slidesArr.push({
                            $placeHolder: $emptySlider,
                            slideScope: childScope
                        });
                    }

                    var watchDestroyer = scope.$watch(itemsProp + '.length', function () {
                        if (angular.isUndefined(items)) {
                            items = scope.$eval(itemsProp);
                            for (var i = 0; i < items.length; i++) {
                                addEmptySlide(i);
                            }
                        }
                        //add the first questions once the slides were added
                        $timeout(function () {
                            addActiveSlideWatch();
                        });
                        watchDestroyer();
                    });

                    function setSlideContent(index) {
                        var slide = slidesArr[index];

                        if (slide.contentScope) {
                            return;
                        }

                        var childScope = slide.slideScope.$new();
                        slide.contentScope = childScope;

                        transclude(childScope, function (clone) {
                            var $ph = slide.$placeHolder;
                            $ph.append(clone);
                            $ph[0].style['max-width'] = 'initial';
                            $ph[0].style.left = 0;
                            //added in order to prevent the question rendering jump
                            $timeout(function () {
                                $ph[0].style.display = 'block';
                            });
                        });
                    }

                    function removeSlideContent(index) {
                        var slide = slidesArr[index];

                        var $ph = slide.$placeHolder;
                        var phHtmlElement = $ph[0];
                        phHtmlElement.style.display = 'none';
                        phHtmlElement.style['max-width'] = '0';

                        if (!slide.contentScope) {
                            return;
                        }

                        $ph.empty();
                        slide.contentScope.$destroy();
                        delete slide.contentScope;
                    }

                    function addActiveSlideWatch() {
                        scope.$watch(attrs.activeSlide, function (newSlideNum, oldSlideNum) {
                            if (angular.isUndefined(newSlideNum)) {
                                newSlideNum = 0;
                            }

                            $timeout(function(){
                                if (angular.isDefined(oldSlideNum) && newSlideNum !== oldSlideNum) {
                                    if (Math.abs(oldSlideNum - newSlideNum) > 1) {
                                        removeSlideContent(oldSlideNum);

                                        if (oldSlideNum !== slidesArr.length - 1) {
                                            removeSlideContent(oldSlideNum + 1);
                                        }

                                        if (oldSlideNum !== 0) {
                                            removeSlideContent(oldSlideNum - 1);
                                        }
                                    } else {
                                        if (oldSlideNum > newSlideNum) {
                                            if (oldSlideNum !== slidesArr.length - 1) {
                                                removeSlideContent(oldSlideNum + 1);
                                            }
                                        } else {
                                            if (oldSlideNum !== 0) {
                                                removeSlideContent(oldSlideNum - 1);
                                            }
                                        }
                                    }
                                }

                                setSlideContent(newSlideNum);
                                if (newSlideNum !== 0) {
                                    setSlideContent(newSlideNum - 1);
                                }

                                if (newSlideNum !== slidesArr.length - 1) {
                                    setSlideContent(newSlideNum + 1);
                                }
                            });
                        });
                    }

                    /*                    scope.$watch(currentSlideWatchFn,function(newVal,oldVal){
                     if(angular.isUndefined(newVal)){
                     return;
                     }
                     addSlideContent(0);
                     addSlideContent(1);
                     addSlideContent(2);
                     $timeout(function(){
                     */
                    /*                            if(angular.isDefined(oldVal) && newVal !== oldVal){
                     slidesArr[oldVal].style.display = 'none';
                     slidesArr[oldVal].style['max-width'] = '0';

                     if(oldVal !== 0){
                     slidesArr[oldVal - 1].style.display = 'none';
                     slidesArr[oldVal - 1].style['max-width'] = '0';
                     }

                     if(oldVal !== slidesArr.length - 1){
                     slidesArr[oldVal + 1].style.display = 'none';
                     slidesArr[oldVal + 1].style['max-width'] = '0';
                     }
                     }

                     slidesArr[newVal].style.display = 'block';
                     slidesArr[newVal].style['max-width'] = 'initial';
                     if(newVal !== 0){
                     slidesArr[newVal - 1].style.display = 'block';
                     slidesArr[newVal - 1].style['max-width'] = 'initial';
                     }

                     if(newVal !== slidesArr.length - 1){
                     slidesArr[newVal + 1].style.display = 'block';
                     slidesArr[newVal + 1].style['max-width'] = 'initial';
                     }*/
                    /*
                     });
                     });*/
                }
            };
        }
    ]);
})(angular);
