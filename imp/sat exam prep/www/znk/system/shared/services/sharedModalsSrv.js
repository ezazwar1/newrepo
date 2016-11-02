(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('SharedModalsSrv', [
        'ZnkModalSrv', 'IapSrv', 'GoBackHardwareSrv', '$rootScope',
        function (ZnkModalSrv, IapSrv, GoBackHardwareSrv,$rootScope) {
            var SharedModalsSrv = {};

            var loadingSpinnerModal = {
                templateUrl: 'znk/system/shared/templates/spinnerModal.html',
                hideBackdrop: true,
                wrapperClass: 'loading-spinner',
                dontCloseOnBackdropTouch: true
            };
            SharedModalsSrv.showloadingSpinnerModal = ZnkModalSrv.singletonModalFn(loadingSpinnerModal);

            SharedModalsSrv.showIapModal = function(){
                return IapSrv.getSubscription().then(function(hasSubscription){
                    if(hasSubscription){
                        return null;
                    }
                    var options = {
                        templateUrl: 'znk/system/shared/templates/iapModal.html',
                        wrapperClass: 'iap show-hide-animation',
                        ctrl: 'IapModalCtrl',
                        showCloseBtn: true
                    };
                    var iapModalInstance = ZnkModalSrv.modal(options);
                    GoBackHardwareSrv.registerBaseModalHandler(iapModalInstance);
                    return iapModalInstance;
                });
            };

            SharedModalsSrv.showHintModal = function(top, left, radius,text, wrapClass,pngSeqOptions){
                var showHintModalScope = $rootScope.$new(true);

                var options = {
                    templateUrl: 'znk/system/shared/templates/transparentCircleModal.html',
                    scope: showHintModalScope,
                    wrapperClass:  wrapClass,
                    ctrl: 'transparentCircleModalCtrl',
                    ctrlAs:'ctrl',
                    showCloseBtn: true,
                    dontCentralize: true,
                    resolve: {
                       pos: {
                           top: top,
                           left: left
                       },
                       config: {
                           radius: radius,
                           initText: text
                       },
                       pngSeqOptions: {
                           startIndex: pngSeqOptions.startImgIndex,
                           endIndex: pngSeqOptions.endImgIndex,
                           imgData: pngSeqOptions.imgData,
                           classToAdd:pngSeqOptions.classToAdd,
                           leftOffset: pngSeqOptions.leftOffset,
                           topOffset: pngSeqOptions.topOffset,
                           rotateLeftOffset: pngSeqOptions.rotateLeftOffset,
                           onTapCloseModal: pngSeqOptions.onTapCloseModal,
                           autoClose: pngSeqOptions.autoClose
                       }
                    }
                };

                var tranparentCircleModalInstance = ZnkModalSrv.modal(options);

                tranparentCircleModalInstance.setText = function(text){
                    showHintModalScope.ctrl.text = text;
                };

                return tranparentCircleModalInstance;
            };

            return SharedModalsSrv;
        }
    ]);
})(angular);
