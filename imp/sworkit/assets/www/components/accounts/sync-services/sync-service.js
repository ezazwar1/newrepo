angular
    .module('swMobileApp')
    .factory('SyncService', function ($firebaseObject, $firebaseArray, $q, FirebaseService, $log) {

        // LOCAL SYNC LOG

        function writeToSyncLogLocal(key, lastUpdated, callback) {
            lastUpdated = lastUpdated || (new Date()).getTime();
            localforage.setItem('sync_' + key, lastUpdated, function () {
                // TODO: handle error
                if (callback) callback();
            });

            return lastUpdated;
        }

        function getFromSyncLogLocal(key, callback) {
            localforage.getItem('sync_' + key, function (result, error) {
                // TODO: handle error
                callback(result);
            });
        }

        return {

            writeSyncLogLocal: writeToSyncLogLocal,
            // SYNC OBJECT

            syncObject: function (localObject, key, properties) {
                var q = $q.defer();

                if (!FirebaseService.authData) {
                    // not logged in
                    $log.warn("No auth data");
                    q.reject("No auth data");
                    return q.promise;
                }
                // Returns a promise to synchronise, with updated object to be stored locally
                // NB: Local update should be made by calling function

                // This function will use (a) param key and (b) object key as a sync key

                // Flow control

                var qAll = {};						// Hash of q objects to track each key
                var qAllPromises = {};		// Hash of promises for q objects above

                // Create promises for each objectKey (NB Only properties present in local object will be synced!)
                var objectKeys = (!!properties) ? properties : Object.keys(localObject);
                objectKeys.forEach(function (objectKey) {
                    var qThis = $q.defer();
                    qAll[objectKey] = qThis;
                    qAllPromises[objectKey] = qThis.promise;
                });

                $q.all(qAllPromises)
                    .then(function (syncUpdates) {
                        for (var key in syncUpdates) {
                            if (syncUpdates[key] === undefined) {
                                delete syncUpdates[key];
                            }
                        }
                        //console.log('syncUpdates', syncUpdates);

                        firebaseObject.$save()
                            .then(function (ref) {
                                // Success
                                // console.log('Saving firebase updates')
                            }, function (error) {
                                console.log("Error:", error);
                                // TODO: Handle error?
                            });

                        q.resolve(syncUpdates);
                    });

                // Firebase stuff

                //var firebaseUID = FirebaseService.authData.uid;
                var firebaseUID = FirebaseService.getUserUID();
                // firebaseUID = "notMyUid";	// test invalid UID
                var firebaseObject = $firebaseObject(FirebaseService.ref.child(firebaseUID).child(key));

                firebaseObject.$loaded()
                    .then(function () {

                        objectKeys.forEach(function (objectKey) {
                            var qThis = qAll[objectKey]

                            var syncLogKey = key + '.' + objectKey;

                            getFromSyncLogLocal(syncLogKey, function (localSyncLogLastUpdated) {
                                if (!localSyncLogLastUpdated) {
                                    // No local sync log entry yet

                                    if (!firebaseObject[objectKey]) {
                                        // No firebase value yet, so local value will be golden source (so just set local sync log to now)

                                        localSyncLogLastUpdated = writeToSyncLogLocal(syncLogKey);		// TODO: Check success?
                                    }

                                }

                                // We have a value for localSyncLogLastUpdated now (or there is no value but a firebase entry exists)
                                // console.log(syncLogKey, localSyncLogLastUpdated);
                                if (
                                    !firebaseObject[objectKey] ||
                                    (localSyncLogLastUpdated && firebaseObject[objectKey].sync_lastUpdated < localSyncLogLastUpdated)
                                ) {
                                    // Firebase entry does not exist or is out of date - update firebase

                                    firebaseObject[objectKey] = {
                                        sync_value: localObject[objectKey],
                                        sync_lastUpdated: localSyncLogLastUpdated
                                    };

                                    //console.log("Preparing to update firebase", objectKey, firebaseObject[objectKey]);
                                    qThis.resolve();

                                } else if (
                                    !localSyncLogLastUpdated || localSyncLogLastUpdated < firebaseObject[objectKey].sync_lastUpdated
                                ) {
                                    // Local sync entry does not exist or is out of date - update local

                                    //console.log("Saving locally", objectKey, firebaseObject[objectKey]);
                                    qThis.resolve(firebaseObject[objectKey].sync_value);

                                    // TODO: Do we need to check local was updated successfully before entry to sync log?
                                    writeToSyncLogLocal(syncLogKey, firebaseObject[objectKey].sync_lastUpdated);

                                } else if (
                                    localSyncLogLastUpdated == firebaseObject[objectKey].sync_lastUpdated
                                ) {
                                    // No change - do nothing
                                    qThis.resolve();

                                } else {
                                    // TODO: This should logically never happen - but include for debugging / testing for now
                                    console.log("Unexpected condition!");
                                }

                            });
                        });
                    });

                return q.promise;

            },

            // SYNC ARRAY

            syncArray: function (localArray, key, arrayElementIdProperty) {
                if (!arrayElementIdProperty) arrayElementIdProperty = '$id';

                var q = $q.defer();

                if (!FirebaseService.authData) {
                    // not logged in
                    $log.warn("No auth data");
                    q.reject("No auth data");
                    return q.promise;
                }

                // Returns a promise to synchronise
                // This function will use (a) param key and (b) whatever value is stored under arrayElementIdProperty as sync key

                var firebaseUID = FirebaseService.getUserUID();
                //console.log("firebaseUID", firebaseUID);
                var debugRef = FirebaseService.ref.child(firebaseUID).child(key);
                //console.log("debugRef", debugRef);
                var firebaseArray = $firebaseArray(debugRef);

                firebaseArray.$loaded()
                    .then(function () {

                        // Flow control

                        var qAll = [];						// Array of q objects to track each element in firebase array
                        var qAllPromises = [];		// Array of promises for q objects above

                        // Firebase stuff

                        // First check everything in firebase - there should be an entry here for every synced entry in local copy

                        firebaseArray.forEach(function (firebaseElement) {
                            var qThis = $q.defer();
                            qAll.push(qThis);
                            qAllPromises.push(qThis.promise);

                            var syncLogKey = key + '.' + firebaseElement.$id;

                            getFromSyncLogLocal(syncLogKey, function (localSyncLogLastUpdated) {

                                if (firebaseElement.sync_isDeleted) {

                                    // check element is locally deleted too
                                    if (localSyncLogLastUpdated != 'd') {
                                        // delete locally

                                        //console.log('Deleting locally', syncLogKey);
                                        writeToSyncLogLocal(syncLogKey, 'd', function () {
                                            qThis.resolve();
                                        });

                                    } else {
                                        // already deleted both remotely and locally
                                        qThis.resolve();

                                    }

                                } else if (!localSyncLogLastUpdated) {
                                    // No local sync log entry yet

                                    //console.log('No local array element for firebase entry - firebase version will be included');
                                    writeToSyncLogLocal(syncLogKey, firebaseElement.sync_lastUpdated);
                                    qThis.resolve();

                                } else if (localSyncLogLastUpdated == 'd') {
                                    // element deleted locally (but not remotely, otherwise previous 'if' condition would have been met)

                                    // need to delete remotely
                                    //console.log("Remote logical delete", firebaseElement);
                                    firebaseElement.sync_isDeleted = true;
                                    firebaseArray.$save(firebaseElement)
                                        .then(function (ref) {
                                            //console.log("Remote logical delete successful", ref.key(), ref);
                                        });
                                    qThis.resolve();

                                } else if (localSyncLogLastUpdated < firebaseElement.sync_lastUpdated) {
                                    // Local sync entry not exist is is out of date - update local

                                    //console.log("Local array element out of date - firebase version will be used", firebaseElement.$id, firebaseElement);
                                    writeToSyncLogLocal(syncLogKey, firebaseElement.sync_lastUpdated);
                                    qThis.resolve();

                                } else if (localSyncLogLastUpdated == firebaseElement.sync_lastUpdated) {
                                    // Both the same

                                    // console.log("Elements already in sync", firebaseElement.$id, firebaseElement);
                                    qThis.resolve();

                                } else if (localSyncLogLastUpdated > firebaseElement.sync_lastUpdated || !firebaseElement.sync_lastUpdated) {
                                    // Local copy is more recent - update firebase

                                    // Find element in local array (by id)
                                    var localVersion = localArray.reduce(function (result, element) {
                                        if (result) return result;

                                        if (element[arrayElementIdProperty] == firebaseElement.$id) {
                                            return element;
                                        }
                                        return null;
                                    }, null);

                                    if (!localVersion) {
                                        // No version in local array but there is a sync log entry
                                        console.log("Unexpected condition! (No version in local array but there is a sync log entry)");
                                    }

                                    Object.keys(localVersion).forEach(function (key) {
                                        firebaseElement[key] = localVersion[key];
                                    });
                                    firebaseElement['$lastUpdated'] = localSyncLogLastUpdated;
                                    firebaseArray.$save(firebaseElement)
                                        .then(function (ref) {
                                            //console.log("Saved", ref.key(), ref), firebaseElement;
                                        });

                                    //console.log("Local array element newer - saving to firebase", firebaseElement.$id, firebaseElement);
                                    qThis.resolve();
                                } else {
                                    console.log("Exception not resolved:", firebaseElement.$id, firebaseElement);
                                    qThis.resolve();
                                }

                            });

                        });

                        // Q objects (qAll) have now been synchronously created, and are being asynchronously executed

                        $q.all(qAllPromises)
                            .then(function () {

                                // All tracked elements should be in sync by now

                                // Check if there are new elements in local array not added to sync yet, and create promises for these to happen
                                qNewElements = [];
                                qNewElementsPromises = [];

                                localArray.forEach(function (element) {
                                    if (!element[arrayElementIdProperty]) {

                                        var qThis = $q.defer();
                                        qNewElements.push(qThis);
                                        qNewElementsPromises.push(qThis.promise);

                                        firebaseArray.$add(element)
                                            .then(function (ref) {
                                                //console.log('Firebase added', ref.key());

                                                var syncLogId = key + '.' + ref.key();

                                                // Add updated time
                                                var sync_lastUpdated = writeToSyncLogLocal(syncLogId);

                                                var rec = firebaseArray.$getRecord(ref.key());
                                                var index = firebaseArray.$indexFor(ref.key())
                                                //console.log(JSON.stringify(rec));
                                                rec.sync_lastUpdated = sync_lastUpdated;
                                                //console.log(JSON.stringify(rec));
                                                //console.log("index", index);

                                                firebaseArray.$save(index)
                                                    .then(function (ref) {
                                                        //console.log("Saved", ref.key());
                                                        qThis.resolve();
                                                    });
                                                // TODO: Error handling for above

                                            });

                                    }
                                });

                                // Q objects (qNewELements) have now been synchronously created, and are being asynchronously executed

                                $q.all(qNewElementsPromises)
                                    .then(function () {

                                        // Everything should be in sync now

                                        // Get actual array elements from firebaseArray object
                                        var syncResult = [];
                                        firebaseArray.forEach(function (firebaseElement) {
                                            if (firebaseElement.sync_isDeleted) {
                                                return;
                                            }

                                            syncResult.push(firebaseElement);
                                        });

                                        // console.log(syncResult);
                                        q.resolve(syncResult);

                                    });

                            });

                    });

                return q.promise;

            },

            deleteFromArray: function (key, arrayElementIdProperty, syncIdValue, callback) {

                // log locally that we are deleting
                var syncLogKey = key + '.' + syncIdValue;
                writeToSyncLogLocal(syncLogKey, 'd', function () {

                    if (callback) callback();

                });

            },

            checkArray: function (localArray, key) {
                if (!FirebaseService.authData) {
                    // not logged in
                    $log.warn("No auth data");
                    return;
                }

                // When user first signs in or logs in, we need to check if a custom workout exists
                // with the same name as a custom workout they have locally. Then we can sync.

                var firebaseArray = $firebaseArray(FirebaseService.ref.child(FirebaseService.getUserUID()).child(key));

                var customWorkoutsArray = [];
                var checkedArray = PersonalData.GetCustomWorkouts.savedWorkouts;

                checkedArray.forEach(function (workoutElement, workoutKey) {
                    customWorkoutsArray.push(workoutElement.name);
                });

                firebaseArray.$loaded()
                    .then(function () {

                        // May want to refactor this with real promises. Fake promises are sad.

                        _.each(firebaseArray, function (firebaseElement) {
                            if (customWorkoutsArray.indexOf(firebaseElement.name) !== -1) {
                                PersonalData.GetCustomWorkouts.savedWorkouts.splice(customWorkoutsArray.indexOf(firebaseElement.name), 1);
                            }
                        }, syncCheckedData())

                    });
                var thisService = this;
                var syncCheckedData = function () {
                    localforage.setItem(key, PersonalData.GetCustomWorkouts,
                        thisService.syncArray(localArray, key)
                            .then(function (syncResult) {
                                // Update local object with result of sync

                                var newLocalForageObject = {};
                                newLocalForageObject['savedWorkouts'] = syncResult;
                                localforage.setItem('customWorkouts', newLocalForageObject);
                                //console.log("Finishing syncLocalCustomWorkout from checkArray ", newLocalForageObject)
                                PersonalData.GetCustomWorkouts = newLocalForageObject;

                                //console.log('Sync complete from checkArray', 'customWorkouts');

                            })
                    );
                }
            },
            pushArray: function (arrayItem, key) {
                if (!FirebaseService.authData) {
                    return;
                }

                var firebaseArray = $firebaseArray(FirebaseService.ref.child(FirebaseService.getUserUID()).child(key));
                firebaseArray.$loaded()
                    .then(function () {
                        firebaseArray.$add(arrayItem);
                    });

                return true;

            }

        }

    });



	