'use strict';

(function(angular) {

    angular.module('znk.sat').controller('transparentCircleHintCtrl', ['$scope', '$document', '$timeout', 'MobileSrv', 'config',
        function($scope, $document, $timeout, MobileSrv, config) {

            var focusedItem = $document[0].querySelector(config.focusedItemClassName);
            var pos;

            if(focusedItem){
                pos = focusedItem.getBoundingClientRect();
            }else{
                $scope.close();
                return;
            }

            this.focusedItemPos = {};
            this.focusedItemPos.left = pos.left + config.focusedItemleftOffset;
            this.focusedItemPos.top = pos.top + config.focusedItemTopOffset;
            this.radius = config.circleRadius;
            this.text = config.text;
            this.arrowTopPosition = pos.top + config.arrowTopOffset;
            this.arrowLeftPosition = pos.left + config.arrowLeftOffset;

            this.focusedItemClickHandler = function(){
                $timeout(function(){
                    angular.element(focusedItem).triggerHandler('click');
                },0)
            }
        }
    ]);
})(angular);
