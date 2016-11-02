/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.factory('StorageFactory', [
        'localStorageService',
        function (localStorageService) {

            return {
                // localstorage prefix for frizisto app
                prefix: 'auth.stylecheck.app',
                keys: ['tokenType', 'accessToken', 'email', 'refreshToken', 'logged_in', 'dbname', 'userId', 'permission'],
                // keys could be a string to get a single value, but also can be an array of keys to get multiple
                get: function (keys) {
                    if (typeof keys === 'string') {
                        return localStorageService.get(this.prefix + '.' + keys);
                    }
                    var i = 0,
                        results = {};

                    for (i; i < keys.length; i = i + 1) {
                        results[keys[i]] = localStorageService.get(this.prefix + '.' + keys[i]);
                    }

                    return results;
                },
                // keys could be a string (to set single value), but also can be an object with key: value pairs to set multiple
                add: function (keys, value) {
                    if (typeof keys === 'string') {
                        localStorageService.add(this.prefix + '.' + keys, value);
                        return value;
                    }
                    var i;

                    for (i in keys) {
                        if (keys.hasOwnProperty(i)) {
                            if (!localStorageService.add) {
                                localStorageService.set(this.prefix + '.' + i, keys[i]);
                            } else {
                                localStorageService.add(this.prefix + '.' + i, keys[i]);
                            }
                        }
                    }
                    return keys;
                },
                // keys could be a string (to delete single value), but also can be an array of keys to delete multiple
                remove: function (keys) {
                    if (typeof keys === 'string') {
                        return localStorageService.remove(this.prefix + '.' + keys);
                    }
                    var i = 0;

                    for (i; i < keys.length; i = i + 1) {
                        localStorageService.remove(this.prefix + '.' + keys[i]);
                    }

                    return;
                }
            };
        }
    ]);
});
