'use strict';

(function(angular) {

    angular.module('znk.sat').factory('LocalDatabaseSrv', ['$rootScope', 'pouchDB', '$q', '$window', '$http', LocalDatabaseSrv]);

    function LocalDatabaseSrv($rootScope, pouchDB, $q, $window, $http) {

        var dbReadyDfd = $q.defer(),
            dbReadyPromise = dbReadyDfd.promise,
            dbMap = {},
            userId,
            deviceReady;

        // TODO: ?? for readability we should prefix name with '_'
        // but that would mean existing users will have to download thier content all over again
        var databases = {
            content: {
                name: 'content',
                preloaded: true
            },
            storage: {
                name: '_storage' // content is already lost, at least we'll save storage
            }
        };

        var databaseNames = Object.keys(databases).reduce(function(dictionary, key) {
            dictionary[key] = databases[key].name;
            return dictionary;
        }, {});

        $rootScope.$on('auth:login', function(event, authData) {
            userId = authData.uid;
            tryToInitDB();
        });

        $rootScope.$on('auth:logout', function() {
            dbReadyDfd = $q.defer();
            dbReadyPromise = dbReadyDfd.promise;
            userId = undefined;
            dbMap = {};
        });

        function instance(name) {
            return dbReadyPromise.then(function() {
                return dbMap[name];
            });
        }

        function onDeviceReady() {
            deviceReady = true;
            tryToInitDB();
        }

        function tryToInitDB() {
            if (!Object.keys(dbMap).length && deviceReady && userId) {
                initDB();
                return true;
            }

            return false;
        }

        function initDB() {
            var preloadPromises = [];

            var databasesConfig = Object.keys(databases).map(function(key) {
                return databases[key];
            });

            databasesConfig.forEach(function(dbConfig) {
                var dbName = userId + dbConfig.name + '_v2',
                    sourceName;

                if (dbConfig.preloaded) {
                    sourceName = dbConfig.name + '.db';
                }

                dbMap[dbConfig.name] = pouchDB(dbName, {
                    adapter: 'websql',
                    location: 2,
                    createFromLocation: (dbConfig.preloaded ? 1 : 0),
                    sourceDbName: sourceName,
                    androidDatabaseImplementation: 2
                });

                // HACK: desktop preload behavior
                if(!$window.cordova && dbConfig.preloaded) {
                    var promise = $http.get('assets/offline/' + dbConfig.name + '.json').then(function(preloadedJson) {
                        var bulkData = Object.keys(preloadedJson.data).map(function(name) {
                            var contentData = preloadedJson.data[name];
                            if (angular.isArray(contentData)) {
                                var contentObj = {};
                                contentObj[name] = contentData;
                                contentData = contentObj;
                            }
                            contentData._id = name;
                            return contentData;
                        });

                        return dbMap[dbConfig.name].bulkDocs(bulkData);
                    });
                    preloadPromises.push(promise);
                }
            });

            $q.all(preloadPromises).then(function() {
                dbReadyDfd.resolve();
            });
        }

        function getReadyPromise() {
            return dbReadyPromise;
        }

        return {
            getReadyPromise: getReadyPromise,
            instance: instance,
            onDeviceReady: onDeviceReady,
            databases: databaseNames
        };
    }

})(angular);
