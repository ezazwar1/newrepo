/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('homePath', [
        '$window', '$timeout', '$document', '$interval', '$animate', '$q',
        function ($window,$timeout,$document,$interval,$animate,$q) {
            var isMobile = $window.innerWidth <= 567;
            return {
                templateUrl: 'znk/home/templates/homePathDrv.html',
                restrict: 'E',
                scope: {
                    items: '&?',
                    itemTemplate: '@',
                    activeItem: '@',
                    scrollToActiveDaily:'&'
                },
                link: function (scope, element, attrs, index) {
                    //was added in order to prevent breaking within inner scopes
                    scope.d = {
                        itemTemplate: scope.itemTemplate,
                        items: scope.items(),
                        isMobile: isMobile
                    };

                    var repeaterHeight,
                        numOfItemsOnRepeater,
                        initialRoadMapHeight,
                        numOfItemsInInitialRoadMap,
                        initialPartsPos = [],
                        repeatedPartsPos = [],
                        itemsOffset,
                        viewBoxSideOffset,
                        viewBoxHeightOffset,
                        viewBoxWidth,
                        baseWidth;


                    if (isMobile) {
                        baseWidth = 320;
                        initialRoadMapHeight = 1755;
                        repeaterHeight = 630;
                        numOfItemsOnRepeater = 3;
                        numOfItemsInInitialRoadMap = 5;
                        viewBoxSideOffset = -35;
                        viewBoxHeightOffset = -400;
                        viewBoxWidth = 1192;

                        itemsOffset = 170;
                        initialPartsPos.push({left: 77, top: 118});
                        initialPartsPos.push({left: 209, top: 190});
                        initialPartsPos.push({left: 177, top: 300});
                        initialPartsPos.push({left: 30, top: 274});
                        initialPartsPos.push({left: 110, top: 366});

                        repeatedPartsPos[0] = {left: 215, top: 470};
                        repeatedPartsPos[1] = {left: 12, top: 441};
                        repeatedPartsPos[2] = {left: 100, top: 535};

                    } else {
                        baseWidth = 768;
                        initialRoadMapHeight = 2400;
                        repeaterHeight = 1384;
                        numOfItemsOnRepeater = 5;
                        numOfItemsInInitialRoadMap = 8;
                        viewBoxSideOffset = 0;
                        viewBoxHeightOffset = 0;
                        viewBoxWidth = 1536;

                        itemsOffset = 692;
                        initialPartsPos.push({left: 167, top: 115});
                        initialPartsPos.push({left: 477, top: 40});
                        initialPartsPos.push({left: 616, top: 362});
                        initialPartsPos.push({left: 364, top: 257});
                        initialPartsPos.push({left: 198, top: 435});
                        initialPartsPos.push({left: 95, top: 679});
                        initialPartsPos.push({left: 478, top: 595});
                        initialPartsPos.push({left: 604, top: 566});

                        repeatedPartsPos[0] = {left: 405, top: 907};
                        repeatedPartsPos[1] = {left: 167, top: 1127};
                        repeatedPartsPos[2] = {left: 430, top: 1285};
                        repeatedPartsPos[3] = {left: 557, top: 1251};
                        repeatedPartsPos[4] = {left: 560, top: 1560};
                    }

                    var widthRatio = $window.innerWidth/baseWidth;

                    //set in order to display the road map while waiting for the dailies items

                    scope.getNumber = function (num) {
                        return new Array(num);
                    };

                    scope.setPos = function (index) {
                        return 'translateY(' + (index * repeaterHeight) + 'px)';
                    };

                    scope.d.getItemStyle = function(index){
                        var pos = itemsPos[index];
                        var itemStyle = {};
                        itemStyle['-webkit-transform'] = itemStyle['transform'] = 'translate3d(' + pos.left + 'px, ' + pos.top + 'px,0)';
                        return itemStyle;
                    };

                    scope.d.showFootPrints = function(dailyNumber){
                        var deferred = $q.defer();

                        var watchFootPrints = scope.$watch(function(){
                            return element[0].querySelectorAll('.one-foot-print' + dailyNumber);
                        }, function(footPrintsArr){
                            if(footPrintsArr ) {
                                var index = 0;

                                $interval(function () {
                                    footPrintsArr[index++].style['display'] = 'block';
                                    if (index === footPrintsArr.length) {
                                        $animate.leave(angular.element(footPrintsArr));
                                        deferred.resolve();
                                    }
                                }, 150, footPrintsArr.length);
                                watchFootPrints();
                            }
                        });
                        return deferred.promise;
                    };

                    function setNumOfRepeats(numOfRepeats){
                        scope.numOfRepeats = numOfRepeats;
                        scope.viewBoxHeight = ( scope.numOfRepeats * repeaterHeight) + initialRoadMapHeight;
                        element.find('svg').attr('viewBox',viewBoxSideOffset + ' ' + viewBoxHeightOffset + ' ' + viewBoxWidth + ' ' + scope.viewBoxHeight);
                    }

                    setNumOfRepeats(2);

                    var itemsPos = [];
                    var watchDestroyer = scope.$watch(function () {
                        return scope.items();
                    }, function (newItems) {
                        if (newItems && newItems.length) {
                            watchDestroyer();

                            for(var i=0; i<initialPartsPos.length; i++){
                                var partPos = initialPartsPos[i];
                                partPos.left *= widthRatio;
                                partPos.top *= widthRatio;
                                itemsPos.push(partPos);
                            }

                            for (i = 0; i < newItems.length - numOfItemsInInitialRoadMap; i++) {
                                var repeatedPartPos = repeatedPartsPos[i % repeatedPartsPos.length];
                                repeatedPartPos = {
                                    left: repeatedPartPos.left * widthRatio,
                                    top: (repeatedPartPos.top + (itemsOffset * Math.floor(i / repeatedPartsPos.length)))* widthRatio
                                };
                                itemsPos.push(repeatedPartPos);
                            }

                            scope.d.items = newItems;

                            setNumOfRepeats(Math.ceil((newItems.length - numOfItemsInInitialRoadMap) / numOfItemsOnRepeater));

                            if((+scope.activeItem - 1) % 5 === 0){
                                scope.scrollToActiveDaily()(itemsPos[+scope.activeItem - 1].top);
                            }

                            $timeout(function(){
                                var domeElement = element[0];
                                var path = angular.element(domeElement.querySelectorAll('path:not(.dash)'));
                                for(var j = 0; j< scope.activeItem ; j++){
                                    path.eq(j).addClass('active-path');
                                }
                            },0,false);
                        }
                    });
                }
            };
        }
    ]);
})(angular);

