'use strict';

(function () {


    angular.module('znk.sat').controller('WelcomeCtrl', ['$scope', '$state', 'NetworkSrv', 'ErrorHandlerSrv', 'ENV', 'KeyboardSrv', WelcomeCtrl]);

    function WelcomeCtrl($scope, $state, NetworkSrv, ErrorHandlerSrv, ENV, KeyboardSrv) {
        $scope.d = {};

        var _this = this;

        _this._init = function _init() {
            $scope.isOffline = NetworkSrv.isDeviceOffline();
        };

        $scope.appVersion = ENV.appVersion;

        $scope.$on('connectionChanged', function (event, isOffline) {
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $scope.isOffline = isOffline;
                });
            }
            else {
                $scope.isOffline = isOffline;
            }
        });

        $scope.navigate = function navigate(stateName) {
            $scope.d.videoActions.showPoster();
            if ($scope.isOffline) {
                ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
            }
            else {
                $state.go(stateName);
            }
        };

        _this._init();

        $scope.$on('$destroy',function(){
            KeyboardSrv.hideKeyboard();
        });
    }

})();
