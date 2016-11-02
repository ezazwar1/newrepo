

'use strict';

(function () {

    angular.module('znk.sat').factory('NetworkSrv', ['$rootScope', '$document', '$cordovaNetwork', NetworkSrv]);

    function NetworkSrv($rootScope, $document, $cordovaNetwork) {

        var _this = this;

        var isDeviceOffline = function isDeviceOffline() {
            return _this.isOffline;
        };

        var addListner = function addListner() {

            angular.element($document)[0].addEventListener('online', onOnline, false);

            angular.element($document)[0].addEventListener('offline', onOffline, false);
        };

        var onOnline = function onOnline() {
            _this.isOffline = false;

            onConnectionChanged(_this.isOffline);
        };

        var onOffline = function onOffline() {
            _this.isOffline = true;

            onConnectionChanged(_this.isOffline);
        };

        var onConnectionChanged = function onConnectionChanged(IsOffline) {
            _this.isOffline = IsOffline;
            $rootScope.$broadcast('connectionChanged', _this.isOffline);
        };

        var checkOffline = function checkOffline() {
            var _isOffline;

            try {
                _isOffline = $cordovaNetwork.isOffline();
            } catch (err) { }

            if (_isOffline !== undefined) {
                _this.isOffline = _isOffline;
                return _isOffline;
            }
            else {
                return undefined;
            }
        };

        $rootScope.$on('resume', function () {
            checkOffline();
        });

        return {
            init: addListner,
            isDeviceOffline: isDeviceOffline,
            onConnectionChanged: onConnectionChanged,
            checkOffline: checkOffline
        };
    }

})();
