'use strict';

(function(angular) {

    angular.module('znk.sat').factory('StorageSrv', ['$rootScope', 'LocalDatabaseSrv', 'FirebaseRefSrv', '$timeout', 'ENV', '$q', StorageSrv]);

    function StorageSrv($rootScope, LocalDatabaseSrv, FirebaseRefSrv, $timeout, ENV, $q) {

        /**
         * explanation for different states
         * off: we havn't even tried to sync
         * inProgress: we are syncing right now
         * upToDate: we've initiated a sync and it completed successfully
         * connectionLost: we were synced but then lost firebase connectivity, e.g upToDate but offline
         */

        var syncStates = {
            off: 0,
            inProgress: 1,
            upToDate: 2,
            connectionLost: 3
        };

        var currentSync = {
            state: syncStates.off,
            objectsCount: 0,
            resetPromise: function() {
                this.deferred = $q.defer();
                this.promise = this.deferred.promise;
            },
            notifySyncFromServer: function() {
                this.objectsCount--;
                if (this.objectsCount === 0) {
                    currentSync.state = syncStates.upToDate;
                    killAllListeners();
                    this.deferred.resolve();
                }
            }
        };

        currentSync.resetPromise();

        /**
         * uid: simplelogin:123
         * appName: sat
         */
        var pathArgs = {
            uid: FirebaseRefSrv.uid,
            appName: ENV.firebaseAppScopeName
        };

        var isConnectedToFirebase = false,
            isAuthenticated = false;

        var connectionTimeout = 1500;

        var storagePrefix = 'data/',
            queuePrefix = 'queue/',
            queueIndexKey = 'queueIndex',
            syncLastUpdatedFieldName = 'syncLastUpdated';

        var listenersDictionary = {};

        // e.g /sat
        var appPath = [pathArgs.appName];
        // e.g /users/simplelogin:123
        var globalUserSpacePath = ['users', pathArgs.uid];
        // e.g /sat/users/simplelogin:123
        var appUserSpacePath = [pathArgs.appName, 'users', pathArgs.uid];

        // special paths, contain pointers to other paths
        var resultsPaths = [
            {
                name: 'exerciseResults',
                path: appUserSpacePath.concat(['exerciseResults']),
                depth: 2
            },
            {
                name: 'dailyResults',
                path: appUserSpacePath.concat(['dailyResults']),
                depth: 1
            },
            {
                name: 'examResults',
                path: appUserSpacePath.concat(['examResults']),
                depth: 1
            }
        ];

        // paths to sync 'as-is'

        var globalPaths = ['iap'];

        var globalUserPaths = [
            'subscriptions',
            'transactions',
            'profile'
        ];

        var appUserPaths = [
            'dailyOrder',
            'daily',
            'exerciseProgress',
            'gamification',
            'homepageState',
            'contentSync',
            'flashcards',
            'hint',
            'examStats',
            'userSettings',
            'dailyPersonalization',
            'personalizationStats',
            'estimatedScore'
        ];

        function initSync() {
            currentSync.state = syncStates.inProgress;

            // count ojbects to sync, this includes both plain paths & results path (the ones we point at)
            var syncObjectsCount = globalPaths.length + globalUserPaths.length + appUserPaths.length + resultsPaths.length;

            // find all pointed results objects
            var countPromiseArr = resultsPaths.map(function(resultPathObj) {
                var ref = FirebaseRefSrv.create(resultPathObj.path);
                return countBottomMostChildren(ref);
            });

            $q.all(countPromiseArr).then(function(resolvedCountsArr) {
                // count actual result object
                syncObjectsCount += resolvedCountsArr.reduce(function(a, b) {
                    return a + b;
                });

                currentSync.objectsCount = syncObjectsCount;
            }).then(function() {
                // register sync listeners, once these are established we don't care about going
                // offline in terms of getting data from firebase, since firebase reconnects automatically
                listenToAll(globalPaths);
                listenToAll(globalUserPaths, globalUserSpacePath);
                listenToAll(appUserPaths, appUserSpacePath);
                registerResultListeners(resultsPaths);
            });
        }

        /**
         * listen for changes on all paths
         * @param  {Array} paths    listen to these paths
         * @param  {Array} pathBase (optional) base path
         */
        function listenToAll(paths, pathBase) {
            pathBase = pathBase || [];
            paths.forEach(function(pathAsArr) {
                listen(pathBase.concat([pathAsArr]));
            });
        }

        function registerResultListeners(paths) {
            paths.forEach(function (pathObj) {
                listen(pathObj.path);

                getResultKeysRecursive(pathObj.path, pathObj.depth, function(key) {
                    listen([pathArgs.appName, pathObj.name, key]);
                });
            });
        }

        function getResultKeysRecursive(parentPath, depth, callback) {
            var parentRef = FirebaseRefSrv.create(parentPath);
            addLiveRef(parentPath, parentRef);
            depth--;
            parentRef.on('child_added', function(childSnapshot) {
                if (depth) {
                    getResultKeysRecursive([parentPath, childSnapshot.key()], depth, callback);
                } else if (!isMetadataKey(childSnapshot.key())) {
                    callback(childSnapshot.val());
                }
            });
        }

        function isMetadataKey(key) {
            return (key === syncLastUpdatedFieldName || key[0] === '_');
        }

        function listen(path, handler) {
            var ref = FirebaseRefSrv.create(path);
            addLiveRef(path, ref);

            ref.on('value', function(snapshot) {
                handler = handler || defaultHandler;
                handler(path, snapshot).then(function() {
                    currentSync.notifySyncFromServer();
                });
            });
        }

        function defaultHandler(path, snapshot) {
            var val = snapshot.val();
            // we only store objects so if this an array that's on firebase.. we still should convert it back
            val = asObject(val);
            return internalSet(path, val, {localOnly: true});
        }

        function asObject(objOrArr) {
            var obj = objOrArr;
            if (angular.isArray(objOrArr)) {
                obj = objOrArr.reduce(function(prev, curr, index) {
                    if (curr) {
                        prev[index] = curr;
                    }
                    return prev;
                }, {});
            }

            return obj;
        }

        function countSnapshotLeavesRecursive(snapshot) {
            var count = 0;

            if (snapshot.hasChildren()) {
                snapshot.forEach(function(childSnapshot) {
                    count += countSnapshotLeavesRecursive(childSnapshot);
                });
            } else {
                if (!isMetadataKey(snapshot.key())) {
                    count = 1;
                }
            }

            return count;
        }

        function countBottomMostChildren(ref) {
            var dfd = $q.defer();

            ref.once('value', function(snapshot) {
                if (snapshot.exists()) {
                    dfd.resolve(countSnapshotLeavesRecursive(snapshot));
                } else {
                    dfd.resolve(0);
                }
            });

            return dfd.promise;
        }

        function getDB() {
            return LocalDatabaseSrv.instance(LocalDatabaseSrv.databases.storage);
        }

        function exists(key) {
            return get(key).then(function(value) {
                return value !== null;
            });
        }

        function asKey(keyOrPath) {
            return (angular.isArray(keyOrPath) ? FirebaseRefSrv.joinPath(keyOrPath) : keyOrPath);
        }

        function internalGet(keyOrPath, options) {
            options = options || {};
            var key = asKey(keyOrPath);
            if (options.serverValue) {
                var dfd = $q.defer();
                var ref = getRefByPath(key);
                ref.once('value', function(snapshot) {
                    dfd.resolve(snapshot.val());
                });
                return dfd.promise;
            } else {
                return getDB().then(function(db) {
                    return db.get(storagePrefix + key);
                }).then(function(val) {
                    return val;
                }).catch(function(err) {
                    if (err.status === 404) {
                        return {};
                    }
                });
            }
        }

        function valueSetPromise(keyOrPath,promise){
            if(!valueSetPromise.map){
                valueSetPromise.map = {};
            }

            var key = asKey(keyOrPath);

            if(promise){
                //catch was added in order to release the promise in case of a reject
                var _promise = promise.catch(angular.noop);
                valueSetPromise.map[key] = _promise;
                //remove the key from the map once the promise is fulfilled
                _promise.then(function(){
                    if(valueSetPromise.map[key] === _promise){
                        valueSetPromise.map[key] = null;
                    }
                })
            }

            return $q.when(valueSetPromise.map[key]);
        }

        function get(keyOrPath,__skipSetSync) {
            var setSync = __skipSetSync ? $q.when() : valueSetPromise(keyOrPath);
            return $q.all([currentSync.promise,setSync]).then(function() {
                return internalGet(keyOrPath);
            }).then(function(value) {
                return value || {};
            });
        }

        function internalSet(keyOrPath, value, options) {
            options = options || {};
            var key = asKey(keyOrPath);
            if (options.localOnly) {
                return updateLocal(key, value);
            } else if (!isConnectedToFirebase) {
                // update local copy and then queue write operation
                return updateLocal(key, value).then(function() {
                    return pushQueue(key, value);
                });
            } else {
                if(options.forceLocal){
                    return getCurrentTimestamp().then(function(ts){
                        // add update timestamp
                        value[syncLastUpdatedFieldName] = ts;
                        updateServer(key, value);
                        return updateLocal(key, value);
                    });
                }else{
                    return internalGet(key, {serverValue: true}).then(function (serverValue) {
                        if (!serverValue || serverValue[syncLastUpdatedFieldName] === value[syncLastUpdatedFieldName]) {
                            // we are not behind the server - push changes!
                            return getCurrentTimestamp().then(function(ts){
                                // add update timestamp
                                value[syncLastUpdatedFieldName] = ts;
                                updateServer(key, value);
                                return updateLocal(key, value);
                            });
                        } else {
                            // the server got new data while we were offline - override local data!
                            return updateLocal(key, serverValue);
                        }
                    });
                }
            }
        }

        function updateLocal(key, value) {
            if (!value) {
                return $q.when(value);
            }

            return getDB().then(function(db) {
                return db.upsert(storagePrefix + key, function() {
                    return value;
                });
            }).then(function(response) {
                value._rev = response.rev;
                return value;
            });
        }

        function updateServer(key, value) {
            var dfd = $q.defer();

            var ref = getRefByPath(key);
            ref.set(value, function(error) {
                if (error) {
                    dfd.reject(error);
                } else {
                    dfd.resolve(value);
                }
            });

            return dfd.promise;
        }

        function set(keyOrPath, value) {
            var val = asObject(value);
            var _valueSetPromise = currentSync.promise.then(function() {
                return internalSet(keyOrPath, val, {forceLocal: true});
            });
            valueSetPromise(keyOrPath,_valueSetPromise);
            return _valueSetPromise;
        }

        function addLiveRef(path, ref) {
            var key = asKey(path);
            if (listenersDictionary[key]) {
                listenersDictionary[key].push(ref);
            } else {
                listenersDictionary[key] = [ref];
            }
        }

        function killAllListeners() {
            for (var key in listenersDictionary) {
                var listeners = listenersDictionary[key] || [];
                listeners.forEach(function(listener) {
                    listener.off();
                });
            }

            listenersDictionary = {};
        }

        function getRefByPath(path) {
            var possibleArrayOfRefs = listenersDictionary[asKey(path)];
            return (possibleArrayOfRefs ? possibleArrayOfRefs[0] : FirebaseRefSrv.create(path));
        }

        function getQueue() {
            /**
             * queueIndex used to be an array, but that caused problems so if the user
             * came from an older version we'll migrate him gracefully
             */
            return internalGet(queueIndexKey).then(function(queueArrOrObj) {
                var queueObj = queueArrOrObj || {};
                if (angular.isArray(queueObj)) {
                    queueObj = {
                        array: queueArrOrObj
                    };
                }

                queueObj.array = queueObj.array || [];
                return queueObj;
            });
        }

        function pushQueue(key, value) {
            var prefixedKey = queuePrefix + key;
            return internalSet(prefixedKey, value, {localOnly: true}).then(function() {
                return getQueue();
            }).then(function(queueObj) {
                queueObj = queueObj || {array: []};
                var queueAsArray = queueObj.array;
                var keyIndex = queueAsArray.indexOf(key);
                if (keyIndex > -1) {
                    queueAsArray.splice(keyIndex, 1);
                }
                queueAsArray.push(key);
                return internalSet(queueIndexKey, queueObj, {localOnly: true});
            });
        }

        function popQueue() {
            return getQueue().then(function(queueObj) {
                if (!queueObj.array) {
                    return;
                }

                var queueIndex = queueObj.array;
                var dataKey = queueIndex.shift();
                var updateQueuePromise = internalSet(queueIndexKey, queueObj, {localOnly: true});
                return $q.all([dataKey, updateQueuePromise]);
            }).then(function(resolvedArr) {
                return resolvedArr[0];
            });
        }

        function getQueueLength() {
            return getQueue().then(function(queueObj) {
                return (queueObj.array ? queueObj.array.length : 0);
            });
        }

        function handleQueueItem() {
            return popQueue().then(function(nextKey) {
                if (nextKey) {
                    var prefixedKey = queuePrefix + nextKey;
                    internalGet(prefixedKey).then(function(value) {
                        if (value) {
                            return internalSet(nextKey, value).then(function() {
                                return getDB();
                            }).then(function(db) {
                                return db.remove(storagePrefix + prefixedKey);
                            });
                        }
                    });
                }
            });
        }

        function processQueue() {
            return getQueueLength().then(function(queueLength) {
                var tasks = [];

                for (var i = 0; i < queueLength; i++) {
                    tasks.push(handleQueueItem);
                }

                return serial(tasks);
            });
        }

        function serial(tasks) {
            var prevPromise;
            angular.forEach(tasks, function(task) {
                // first task
                if (!prevPromise) {
                    prevPromise = task();
                } else {
                    prevPromise = prevPromise.then(task);
                }
            });
            return prevPromise;
        }

        function createGuid() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1); // jshint ignore:line
            }

            return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
        }

        function invalidateSyncState() {
            if (isConnectedToFirebase && isAuthenticated) {
                if (currentSync.state === syncStates.off) {
                    initSync();
                } else if (currentSync.state === syncStates.connectionLost) {
                    // this actually isn't the truth but we have no way of knowing how many updates (if any)
                    // will we get from the server. conflict resolutions should take care of any race conditions.
                    currentSync.state = syncStates.upToDate;
                }

                processQueue();

            } else if (!isConnectedToFirebase && isAuthenticated) {

                if (currentSync.state === syncStates.off) {
                    // we are either not connected yet (online) or never gonna connect (offline)
                    $timeout(function() {
                        if (!isConnectedToFirebase) {
                            // still not connected? it's safe to say we're offline
                            currentSync.deferred.resolve();
                        }
                    }, connectionTimeout);
                } else if (currentSync.state === syncStates.inProgress) {
                    // we lost connection during a sync is running, maybe show an error message?
                    // should we reset active connections?
                    currentSync.deferred.resolve();
                    currentSync.state = syncStates.off;
                } else if (currentSync.state === syncStates.upToDate) {
                    // we lost connection after being online and the local data is synced
                    currentSync.state = syncStates.connectionLost;
                }
            } else if (isConnectedToFirebase && !isAuthenticated) {
                // kill all firebase references and reset state
                killAllListeners();

                currentSync.deferred.resolve();
                currentSync.resetPromise();
                currentSync.state = syncStates.off;
            }
        }

        function registerDevice(model, uuid) {
            var devicesRef = FirebaseRefSrv.create(globalUserSpacePath.concat(['devices', model, uuid]));
            devicesRef.child('lastConnected').set(FirebaseRefSrv.serverTimeStamp);
        }

        var _currentSessionRef;
        function registerSession() {
            var sessions = FirebaseRefSrv.create(['sessions', pathArgs.uid]);
            var sessionRef = sessions.push();

            // session history
            sessionRef.child('ended').onDisconnect().set(FirebaseRefSrv.serverTimeStamp);
            sessionRef.child('began').set(FirebaseRefSrv.serverTimeStamp);
            sessionRef.child('app').set(pathArgs.appName);

            _currentSessionRef = sessionRef;
        }

        function endCurrentSession() {
            if (_currentSessionRef) {
                _currentSessionRef.child('ended').onDisconnect().cancel();
                _currentSessionRef.child('ended').set(FirebaseRefSrv.serverTimeStamp);
            }

            _currentSessionRef = undefined;
        }

        function registerLogin(userId, appName) {
            var firstLoginRef = FirebaseRefSrv.create(['firstLogin', appName]);
            firstLoginRef.child(userId).once('value', function(snapshot) {
                if (!snapshot.exists()) {
                    firstLoginRef.child(userId).set(FirebaseRefSrv.serverTimeStamp);
                    registerAppVersion(userId, appName);
                }
            });
        }

        function registerAppVersion(userId, appName){
            var userApp = {};
            if(appName){
                if (ENV.appVersion){
                    userApp[appName] = ENV.appVersion;
                }
                else{
                    userApp[appName] = 'not a device';
                }
            }

            var userAppsRef = FirebaseRefSrv.create(['users',userId, 'appVersion']);
            userAppsRef.set(userApp);
        }

        //@todo(igor) temp save patch
        function syncedSet(keyOrPath, newValue){
            var getEntityProm = get(keyOrPath);
            return getEntityProm.then(function(syncedEntity){
                if(!syncedEntity){
                    syncedEntity = {};
                }

                if(!newValue){
                    newValue = {};
                }else{
                    delete newValue.syncLastUpdated;
                }

                for(var prop in syncedEntity){
                    if(prop !== 'syncLastUpdated' && angular.isUndefined(newValue[prop])){
                        delete syncedEntity[prop];
                    }
                }

                angular.extend(syncedEntity,newValue);
                return set(keyOrPath,syncedEntity);
            });
        }

        var connectedRef = FirebaseRefSrv.create(['.info', 'connected']);
        connectedRef.on('value', function(snap) {
            var online = snap.val();
            var changed = (isConnectedToFirebase !== online);
            isConnectedToFirebase = online;

            if (online && isAuthenticated) {
                registerSession();
            }

            if (changed) {
                invalidateSyncState();
            }
        });

        $rootScope.$on('auth:login', function(event, authData) {
            isAuthenticated = true;
            invalidateSyncState();

            if (isConnectedToFirebase) {
                registerSession();
                registerLogin(authData.uid, ENV.firebaseAppScopeName);
            }
        });

        $rootScope.$on('pause', function() {
            currentSync.state = syncStates.off;
        });

        $rootScope.$on('auth:beforeLogout', function() {
            isAuthenticated = false;
            invalidateSyncState();

            endCurrentSession();
        });

        var getCurrentTimestamp = (function() {
            var defer = $q.defer();

            FirebaseRefSrv.create('/.info/serverTimeOffset').once('value', function(fbTimeOffset) {
                $timeout.cancel(timeoutProm);
                defer.resolve(fbTimeOffset.val());
            });

            var timeoutProm = $timeout(function(){
                defer.resolve(0);
            },3000);

            return function(){
                return defer.promise.then(function(fbTimeOffset){
                    return Date.now() + fbTimeOffset;
                });
            };
        })();

        getCurrentTimestamp();

        return {
            exists: exists,
            get: get,
            set: set,
            serverTimeStamp: FirebaseRefSrv.serverTimeStamp,
            appPath: appPath,
            globalUserSpacePath: globalUserSpacePath,
            appUserSpacePath: appUserSpacePath,
            createGuid: createGuid,
            registerDevice: registerDevice,
            syncedSet: syncedSet
        };
    }

})(angular);
