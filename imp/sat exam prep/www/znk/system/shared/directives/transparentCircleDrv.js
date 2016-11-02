
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('transparentCircleDrv', ['$window',
        function ($window) {
            return {
                templateUrl: 'znk/system/shared/templates/transparentCircleDrv.html',
                scope:{
                    position:'&',
                    circleRadius:'&',
                    text:'=',
                    circleClick:'&?'
                },
                link: function(scope, element){
                    var textElement = angular.element(element[0].querySelector('.text'));
                    var position = scope.position();
                    var circleRadius = scope.circleRadius();
                    var windowWidth = $window.innerWidth;

                    scope.d = {
                        circleLeftPosition: position.left ,
                        circleTopPosition: position.top ,
                        topBlocHeight: position.top + 'px',
                        leftBlockHeight:  circleRadius + 'px',
                        leftBlockWidth:  position.left  + 'px',
                        rightBlockWidth: windowWidth - (circleRadius + position.left) + 'px',
                        rightBlockHeight: circleRadius  + 'px'
                    };
                }
            };
        }
    ]);
})(angular);

