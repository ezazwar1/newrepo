/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('znkTimeline', ['$window',
        function($window) {
            return {
                restrict: 'A',
                scope: {
                    timelineData: '=',
                    timelineSettings: '='
                },
                link: function (scope, element) {

                    var settings = angular.extend({
                        width: $window.innerWidth,
                        height: $window.innerHeight
                    }, scope.timelineSettings || {});

                    var dataObj;

                    var canvasElem = element[0];

                    var ctx = canvasElem.getContext('2d');

                    var lastLine;

                    var nextFlag = false;

                    scope.$watch('timelineData', function(val, oldVal) {
                        if(angular.isDefined(val)) {
                            if(val !== oldVal) {
                                ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
                                start(val);
                            } else {
                                start(val);
                            }
                        }
                    });

                    function start(timelineData) {

                        dataObj = {
                            lastLine: [],
                            biggestScore : {score:0}
                        };

                        lastLine = void(0);

                        if(settings.type === 'multi') {
                            var distance = settings.distance * (timelineData.data.length + 2);
                            settings.width = (distance < $window.innerWidth) ? $window.innerWidth : distance;
                        }

                        if(settings.isMax) {
                            settings.max = 0;
                            angular.forEach(timelineData.data, function(value) {
                                 if(value.score > settings.max) {
                                     settings.max = value.score;
                                 }
                            });
                        }


                            canvasElem.width = settings.width * 2;
                            canvasElem.height = settings.height * 2;

                            canvasElem.style.width = settings.width+'px';
                            canvasElem.style.height = settings.height+'px';

                            ctx.scale(2,2);




                        if(settings.lineWidth) {
                            ctx.lineWidth = settings.lineWidth;
                        }

                        if(angular.isDefined(timelineData.id) && settings.colors && angular.isArray(settings.colors)) {
                            ctx.strokeStyle = settings.colors[timelineData.id];
                            ctx.fillStyle = settings.colors[timelineData.id];
                        }

                        ctx.beginPath();

                        createPath({
                            moveTo: {
                                x: 0,
                                y: settings.height - 2
                            },
                            lineTo: {
                                x: settings.distance,
                                y: settings.height - 2
                            }
                        }, true);

                        angular.forEach(timelineData.data, function(value, index) {

                            var height =  Math.abs((settings.height - settings.subPoint) - ((value.score - settings.min) / (settings.max - settings.min) * (settings.height - (settings.subPoint * 2)) ));
                            var currentDistance = (index + 2) * settings.distance;
                            var isLast = index === (timelineData.data.length - 1);

                            createPath({
                                moveTo: {
                                    x: lastLine.lineTo.x,
                                    y: lastLine.lineTo.y
                                },
                                lineTo: {
                                    x: currentDistance,
                                    y: height

                                },
                                exerciseType: value.exerciseType,
                                exerciseId: value.exerciseId,
                                score: value.score
                            }, false, isLast);

                            if(value.score > dataObj.biggestScore.score) {
                                dataObj.biggestScore = { score: value.score, lastLineTo: lastLine.lineTo };
                            }

                        });

                        if(settings.numbers && angular.isObject(settings.numbers)) {

                            setTimeout(function() {

                                ctx.font = settings.numbers.font;
                                ctx.fillStyle = settings.numbers.fillStyle;

                                ctx.fillText(settings.min, 15, settings.height - 10);
                                ctx.fillText(parseInt(dataObj.biggestScore.score), 15, dataObj.biggestScore.lastLineTo.y || settings.subPoint);

                            });

                        }

                        if(settings.onFinish && angular.isFunction(settings.onFinish)) {
                            settings.onFinish({data: dataObj, ctx : ctx, canvasElem : canvasElem});
                        }

                    }

                    function createPath(data, ignoreAfterPath, isLast) {

                        var arc = 10;
                        var img = 20;

                        if(angular.isDefined(settings.isMobile) && !settings.isMobile) {
                             arc = 15;
                             img = 25;
                        }

                        var subLocation = img / 2;
                        var imgBig;

                        lastLine = data;
                        dataObj.lastLine.push(lastLine);

                        /* create line */
                        ctx.moveTo(data.moveTo.x, data.moveTo.y);
                        ctx.lineTo(data.lineTo.x, data.lineTo.y);
                        ctx.stroke();

                        if(dataObj.summeryScore && !nextFlag) {
                            dataObj.summeryScore.next = data.lineTo;
                            nextFlag = true;
                        }

                        if(settings.isSummery) {
                            if(settings.isSummery === data.exerciseId) {
                                dataObj.summeryScore = { score: data.score, lineTo: data.lineTo,
                                    prev: dataObj.lastLine[dataObj.lastLine.length - 2] };
                                arc = arc * 2;
                                img = img + 15;
                                subLocation = img / 2;
                                imgBig = true;
                            }
                        } else if(isLast) {
                            arc = arc * 2;
                            img = img + 15;
                            subLocation = img / 2;
                            imgBig = true;
                        }


                        if(!ignoreAfterPath) {
                            /* create circle */
                            ctx.beginPath();
                            ctx.arc(data.lineTo.x, data.lineTo.y, arc, 0, 2 * Math.PI, false);
                            ctx.fill();

                            if((isLast && !settings.isSummery) || (settings.isSummery === data.exerciseId)) {
                                ctx.beginPath();
                                ctx.arc(data.lineTo.x, data.lineTo.y, arc + 4, 0, 2 * Math.PI, false);
                                ctx.stroke();
                            }

                            /* create svg icons */
                            var imageObj = new Image();
                            var src;
                            var locationImgY = data.lineTo.y - subLocation;
                            var locationImgX = data.lineTo.x - subLocation;

                            if(dataObj.lastLine.length === 2 && data.exerciseType === 4) {
                                src = settings.images[data.exerciseType].icon;
                                img = (imgBig) ? img : 15;
                                if(angular.isDefined(settings.isMobile) && !settings.isMobile) {
                                    img = (imgBig) ? img : 20;
                                }
                                locationImgY  = locationImgY + 2;
                                locationImgX  = locationImgX + 2;
                            } else if(dataObj.lastLine.length > 2 && data.exerciseType === 4) {
                                src = settings.images[2].icon;
                            } else {
                                src = settings.images[data.exerciseType].icon;
                            }

                            imageObj.src = src;

                            imageObj.onload = function() {
                                ctx.drawImage(imageObj, locationImgX, locationImgY, img, img);
                            };
                        }

                    }

                }
            };
        }
    ]);
})(angular);
