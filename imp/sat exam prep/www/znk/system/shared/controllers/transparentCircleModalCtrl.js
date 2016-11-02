(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('transparentCircleModalCtrl', [
        '$scope', 'pos', 'config', 'pngSeqOptions', '$timeout', '$window',
        function($scope,  pos, config, pngSeqOptions, $timeout, $window){
            var windowWidth = $window.innerWidth;
            var _this = this;

            _this.pos = pos;
            _this.circleRadius = config.radius;
            _this.text = config.initText || '';
            _this.positionClass = null;

            _this.pngSeqSettings = {
                startIndex: pngSeqOptions ? pngSeqOptions.startIndex : null,
                endIndex: pngSeqOptions ? pngSeqOptions.endIndex : null,
                imgArr: pngSeqOptions ? pngSeqOptions.imgData : null,
                classToAdd : pngSeqOptions ? pngSeqOptions.classToAdd : null,
                leftOffset : pngSeqOptions ? pngSeqOptions.leftOffset : null,
                topOffset : pngSeqOptions ? pngSeqOptions.topOffset : null,
                rotateLeftOffset : pngSeqOptions ? pngSeqOptions.rotateLeftOffset : null,
                onTapCloseModal: pngSeqOptions.onTapCloseModal ? $scope.close : angular.noop
            };

            $scope.actions = {};
            $scope.actions.donePlaying = function(){
                $scope.actions.reset();
                if(pngSeqOptions.autoClose){
                    $scope.close();
                }
            };

            if(pos && pos.left < 20){
                _this.positionClass = 'left-edge';
                _this.pngSeqSettings.leftOffset += _this.pngSeqSettings.rotateLeftOffset;
            }

            if(pos && pos.left + config.radius > windowWidth - 20){
                _this.positionClass = 'right-edge';
            }

            $timeout(function () {
                if(angular.isDefined(_this.pngSeqSettings.startIndex) && _this.pngSeqSettings.endIndex && _this.pngSeqSettings.imgArr){
                    $scope.actions.setPngSeqSettings();
                    $scope.actions.play();
                }
            },0);
        }
    ]);
})(angular);
