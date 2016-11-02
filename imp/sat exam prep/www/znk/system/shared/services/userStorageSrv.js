'use strict';

(function () {

    angular.module('znk.sat').factory('UserStorageSrv', ['localStorageService', 'AuthSrv', UserStorageSrv]);

    function UserStorageSrv(localStorageService, AuthSrv) {

        var prefixKey = function prefixKey(key) {
            return AuthSrv.authentication.email + '.' + key;
        };

        var get = function get(key, withoutPrefix) {
            if (!withoutPrefix) {
                key = prefixKey(key);
            }

            return localStorageService.get(key);
        };

        var set = function set(key, value, withoutPrefix) {
            if (!withoutPrefix) {
                key = prefixKey(key);
            }

            localStorageService.set(key, value);
            return value;
        };

        var remove = function remove(key, withoutPrefix) {
            if (!withoutPrefix) {
                key = prefixKey(key);
            }

            localStorageService.remove(key);
        };

        return {
            get: get,
            set: set,
            remove: remove
        };
    }
})();
