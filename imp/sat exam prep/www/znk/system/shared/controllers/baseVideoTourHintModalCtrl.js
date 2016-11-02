(function (angular) {
    'use strict';

    angular.module('znk.sat').controller('BaseVideoTourHintModalCtrl', [
        'MobileSrv','config',
        function (MobileSrv, config) {
            var self = this;
            self.showControlls = false;
            self.isMobile = MobileSrv.isMobile();
            self.config = config;

            function videoEndedHandler(ctrl){
                ctrl.showControlls = true;
            }

            self.videoEndedHandler = function(){
                var handlerFn = config.onVideoEnded || videoEndedHandler;
                handlerFn(self);
            };
        }
    ]);
})(angular);
