(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('GoBackHardwareSrv', [
        '$ionicPlatform', '$rootScope', 'ZnkModalSrv', '$ionicHistory', '$injector', '$state',
        function ($ionicPlatform, $rootScope, ZnkModalSrv, $ionicHistory, $injector, $state) {
            var GoBackHardwareSrv = {};

            var handlersToDestroy = [];

            function _goBack() {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }
            }

            GoBackHardwareSrv.registerHandler = function (handler, priority, destroyAfterTrigger) {
                if (!ionic.Platform.isAndroid()) {
                    return;
                }
                if (angular.isUndefined(priority)) {
                    priority = 200;
                }
                var handlerDestroyer = $ionicPlatform.registerBackButtonAction(function () {
                    $rootScope.$apply(function () {
                        handler();
                        if (destroyAfterTrigger) {
                            handlerDestroyer();
                        }
                    });
                }, priority);
                handlersToDestroy.push(handlerDestroyer);
                return handlerDestroyer;
            };

            function _closeAllModalGoBackHandler() {
                ZnkModalSrv.closeAll();
            }
            GoBackHardwareSrv.registerCloseAllModalsHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _closeAllModalGoBackHandler);

            function _closeAllModalsOrGoBackHandler() {
                if (ZnkModalSrv.isAnyModalOpen()) {
                    _closeAllModalGoBackHandler();
                    return;
                }
                _goBack();
            }
            GoBackHardwareSrv.registerCloseAllModalsOrGoBackHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _closeAllModalsOrGoBackHandler);

            function _closePopupHandler() {
                var PopUpSrv = $injector.get('PopUpSrv');
                PopUpSrv.closePopup(true);
            }
            GoBackHardwareSrv.registerClosePopupHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _closePopupHandler);

            function _closePopupOrGoBackHandler() {
                var PopUpSrv = $injector.get('PopUpSrv');
                if (PopUpSrv.isPopupOpen()) {
                    _closePopupHandler();
                    return;
                }
                _goBack();
            }
            GoBackHardwareSrv.registerClosePopupOrGoBackHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _closePopupOrGoBackHandler);

            function _closePopupAndGoHomeHandler(){
                _closePopupHandler();
                _goHomeHandler();
            }
            GoBackHardwareSrv.registerClosePopupAndGoHomeHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _closePopupAndGoHomeHandler,undefined,true);

            function _goHomeHandler() {
                $state.go('app.home');
            }
            GoBackHardwareSrv.registerGoHomeHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _goHomeHandler);

            GoBackHardwareSrv.registerBaseModalHandler = function(modalInstance){
                function handler(){
                    modalInstance.close();
                }
                modalInstance.promise.finally(function(){
                    handlerDestroyer();
                });
                var handlerDestroyer = GoBackHardwareSrv.registerHandler(handler,undefined,true);
                return handlerDestroyer;
            };

            function _exitAppHandler(){
                navigator.app.exitApp();
            }
            GoBackHardwareSrv.registerExitAppHandler = GoBackHardwareSrv.registerHandler.bind(GoBackHardwareSrv, _exitAppHandler,undefined,true);

            $rootScope.$on('$stateChangeStart', function () {
                handlersToDestroy.forEach(function (handlerDestroyer) {
                    if (handlerDestroyer) {
                        handlerDestroyer();
                    }
                });
                handlersToDestroy = [];
            });

            return GoBackHardwareSrv;
        }
    ]);
})(angular);
