/**
 * @depreacted, use video controll directive instead
 */
(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('videoDimensionDrv',[
        function () {
            return {
                link: {
                    scope:{},
                    pre: function(scope,element,attrs){
                        var domElement = element[0];
                        var parentDomElem = element.parent()[0];

                        var containerWidth = parentDomElem.offsetWidth;
                        var widthToHeightRatio = attrs.widthHeightRatio;
                        var containerHeight = Math.round(angular.isDefined(widthToHeightRatio) ? (+widthToHeightRatio) * containerWidth : parentDomElem.offsetHeight);

                        domElement.style.width = containerWidth + 'px';
                        //black line bug fix for iphone 4
                        domElement.style.height = containerHeight + ((containerHeight % 2) ? 0 : 1)  + 'px';
                    }
                }
            };
        }
    ]);
})(angular);

