/**
 * Created by Igor on 8/19/2015.
 */
/**
 * attrs:
 */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('pngSequence', [
        '$interval', '$timeout', 'ExpansionSrcSrv',
        function ($interval, $timeout, ExpansionSrcSrv) {
            return {
                restrict: 'E',
                scope:{
                    onEnded: '&',
                    loop: '&',
                    speed:'&',
                    autoPlay: '&',
                    actions: '='
                },
                template: '<img style="display:none;">',
                link: function (scope, element, attrs) {
                    var indexBound;
                    var imgSrcArray = [];
                    var imageDomElem = element[0].children[0];

                    function buildComponent(){
                        var startIndex = +attrs.startIndex;
                        var endIndex = +attrs.endIndex;
                        var imageNum;
                        indexBound = endIndex - startIndex;

                        for(var i = startIndex; i < endIndex ; i++){
                            if(i < 100 || i < 10){
                                imageNum = i < 10 ? '00' + i :'0' + i;
                            }else{
                                imageNum = i;
                            }

                            var imgSrc = ExpansionSrcSrv.getExpansionSrc(attrs.imgData + imageNum + '.png');
                            imgSrcArray.push(imgSrc);
                            imageDomElem.src = imgSrc;
                        }
                    }

                    function setPngSeqSettings(){
                        destroyCurrent();
                        buildComponent();
                    }

                    function destroyCurrent(){
                        $interval.cancel(intervalProm);
                        imageDomElem.style.display = 'none';
                        imgSrcArray = [];
                    }

                    var intervalProm;
                    function play(){
                        if(intervalProm){
                            $interval.cancel(intervalProm);
                        }
                        if(imgSrcArray.length === 0){
                            return;
                        }
                        var index = 0;
                        var count = scope.loop() ? 0 : attrs.endIndex - attrs.startIndex;
                        var speed = scope.speed();

                        intervalProm = $interval(function(){
                            if(index === indexBound-1 && !scope.loop()){
                                imageDomElem.style.display = 'none';
                                $interval.cancel(intervalProm);

                                $timeout(function(){
                                    scope.onEnded();
                                });
                            }else{
                                if(index === 0){
                                    imageDomElem.style.display = 'block';
                                }
                                index = (index+1) % indexBound;
                                if(imgSrcArray.length){
                                    imageDomElem.src = imgSrcArray[index];
                                }
                            }
                        },speed, count, false);
                    }

                    scope.actions = scope.actions || {};
                    scope.actions.play = function(){
                        //added in order for the build function to be executed before the play
                        $timeout(function(){
                            play();
                        },0);
                    };
                    scope.actions.reset = destroyCurrent;

                    scope.actions.setPngSeqSettings = setPngSeqSettings;

                    scope.$on('$destroy',function(){
                        $interval.cancel(intervalProm);
                    });
                }
            };
        }
    ]);
})(angular);

