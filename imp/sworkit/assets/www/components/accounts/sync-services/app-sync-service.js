angular
    .module('swMobileApp')
    .factory('AppSyncService', function ($q, SyncService, $window, $log) {

        const LF_CUSTOM_WORKOUTS_KEY = 'customWorkouts';
        const LF_CUSTOM_WORKOUTS_KEY_SUBKEY = 'savedWorkouts';

        const WEBSQL_WORKOUTS_LOG_KEY = 'workoutLog';

        var _syncLocalForageObject = function (key, properties, runtimeObject) {
            //$log.info("_syncLocalForageObject()");
            localforage.getItem(key, function (localforageObject, error) {
                if (localforageObject) {
                    SyncService.syncObject(localforageObject, key, properties)
                        .then(function (syncResult) {

                            // Update local object with result of sync
                            localforage.getItem(key, function (localObject, error) {

                                for (var prop in syncResult) {
                                    //$log.debug(prop, localObject[prop], syncResult[prop]);
                                    localObject[prop] = syncResult[prop];
                                    if (runtimeObject) runtimeObject[prop] = syncResult[prop];
                                }
                                localforage.setItem(key, localObject);

                            });
                            //console.log('Sync complete', key);
                        });
                }
            });
        };

        var self = {

            syncStoredData: function () {
                _syncLocalForageObject('timingSettings', [
                    'breakFreq',
                    'breakTime',
                    'customSet',
                    'exerciseTime',
                    'randomizationOption',
                    'restStatus',
                    'transitionTime',
                    'workoutLength',
                    'sunSalutation',
                    'fullSequence',
                    'runnerYoga',
                    'feelGoodYoga',
                    'beginnerYoga',
                    'coreYoga',
                    'toneYoga'
                ], TimingData.GetTimingSettings);
                _syncLocalForageObject('timingSevenSettings', null, TimingData.GetSevenMinuteSettings);
                _syncLocalForageObject('userGoals', null, PersonalData.GetUserGoals);
                _syncLocalForageObject('userProfile', null, PersonalData.GetUserProfile);
                _syncLocalForageObject('userSettings', [
                    'lastLength',
                    'mfpAccessToken',
                    'mfpRefreshToken',
                    'mfpStatus',
                    'mfpWeight',
                    'weight',
                    'weightType',
                    'humanapiAccessToken',
                    'humanapiClientUserId',
                    'humanapiHumanId',
                    'humanapiPublicToken'
                ], PersonalData.GetUserSettings);

            },

            syncLocalForageObject: _syncLocalForageObject,

            // custom workouts

            syncLocalForageCustomWorkouts: function () {

                localforage.getItem(LF_CUSTOM_WORKOUTS_KEY, function (localforageObject, error) {

                    if (localforageObject) {
                        var customWorkoutsArray = localforageObject[LF_CUSTOM_WORKOUTS_KEY_SUBKEY];

                        SyncService.syncArray(customWorkoutsArray, LF_CUSTOM_WORKOUTS_KEY)
                            .then(function (syncResult) {
                                //console.log('syncResult', syncResult);
                                // Update local object with result of sync
                                var newLocalForageObject = {};
                                newLocalForageObject[LF_CUSTOM_WORKOUTS_KEY_SUBKEY] = syncResult;
                                localforage.setItem(LF_CUSTOM_WORKOUTS_KEY, newLocalForageObject);
                                //console.log("Finishing syncLocalCustomWorkout: ", newLocalForageObject)
                                PersonalData.GetCustomWorkouts = newLocalForageObject;
                                //console.log('Sync complete', LF_CUSTOM_WORKOUTS_KEY);
                            });
                    }
                });
            },

            remoteDeleteFromLocalForageCustomWorkouts: function (syncId) {
                SyncService.deleteFromArray(LF_CUSTOM_WORKOUTS_KEY, '$id', syncId, function () {
                    self.syncLocalForageCustomWorkouts();
                });
            },

            checkLocalForageCustomWorkouts: function () {

                var customWorkoutsArray = PersonalData.GetCustomWorkouts.savedWorkouts;
                SyncService.checkArray(customWorkoutsArray, LF_CUSTOM_WORKOUTS_KEY)
            },

            // completed workouts
            syncWebSqlWorkoutLog: function (allLogsObject) {

                //TODO, remember that Sworkit here will be SworkitFree on Lite app
                db.transaction(function (tx) {
                    tx.executeSql("SELECT * FROM SworkitFree", [], function (tx, results) {

                        // transform reuslts to array
                        var localWorkoutsArray = [];
                        //TODO: should use promises instead of i ==results.rows.length
                        if (results.rows.length == 0) {

                            SyncService.syncArray(localWorkoutsArray, WEBSQL_WORKOUTS_LOG_KEY, 'sync_id')
                                .then(function (syncResult) {

                                    sqlCommands = [];

                                    // Note: could use promises here to check success of sql updates (i.e. before running sql cleanup, etc)

                                    var syncResultSyncIdRegister = {};
                                    // add or update new items
                                    syncResult.forEach(function (remoteWorkout) {
                                        var localWorkout = _.findWhere(localWorkoutsArray, {sync_id: remoteWorkout.$id})
                                        syncResultSyncIdRegister[remoteWorkout.$id] = true;

                                        if (!localWorkout) {
                                            //console.log('   > Creating new local row');
                                            // check for undefined exercise_list to avoid errors in local dv
                                            if (typeof remoteWorkout.exercise_list === 'undefined') {
                                                remoteWorkout.exercise_list = '';
                                            }
                                            // sqlCommands.push( 'INSERT INTO Sworkit(created_on, minutes_completed, calories, type, utc_created, exercise_list) VALUES ((datetime("now","localtime")),?,?,?,datetime("now"),?)', + localWorkout.sworkit_id );
                                            db.transaction(function (tx) {
                                                tx.executeSql('INSERT INTO SworkitFree(sync_id, sync_lastUpdated, created_on, minutes_completed, calories, type, utc_created, exercise_list) VALUES (?,?,?,?,?,?,?,?)',
                                                    [remoteWorkout.$id, remoteWorkout.sync_lastUpdated, remoteWorkout.created_on, remoteWorkout.minutes_completed, remoteWorkout.calories, remoteWorkout.type, remoteWorkout.utc_created, remoteWorkout.exercise_list], function (tx, success) {
                                                        //console.log('success', success)
                                                    }, function (tx, error) {
                                                        console.log('error', error)
                                                    });
                                            });
                                        } else if (localWorkout.sync_lastUpdated < remoteWorkout.sync_lastUpdated) {
                                            //console.log('   > Updating local row', remoteWorkout.$id, remoteWorkout.sync_lastUpdated);
                                            // check for undefined exercise_list to avoid errors in local dv
                                            if (typeof remoteWorkout.exercise_list === 'undefined') {
                                                remoteWorkout.exercise_list = '';
                                            }
                                            db.transaction(function (tx) {
                                                tx.executeSql('UPDATE SworkitFree SET sync_lastUpdated=?, created_on=?, minutes_completed=?, calories=?, type=?, utc_created=?, exercise_list=? WHERE sync_id=?',
                                                    [remoteWorkout.sync_lastUpdated, remoteWorkout.created_on, remoteWorkout.minutes_completed, remoteWorkout.calories, remoteWorkout.type, remoteWorkout.utc_created, remoteWorkout.exercise_list, remoteWorkout.$id], function (tx, success) {
                                                        //console.log('success', success)
                                                    }, function (tx, error) {
                                                        console.warn('error', error)
                                                    });
                                            });
                                        }
                                    });

                                });
                        }
                        else {
                            for (var i = 0; i < results.rows.length; i++) {
                                localWorkoutsArray.push(results.rows.item(i));
                                if (i == results.rows.length - 1) {
                                    SyncService.syncArray(localWorkoutsArray, WEBSQL_WORKOUTS_LOG_KEY, 'sync_id')
                                        .then(function (syncResult) {
                                            sqlCommands = [];

                                            // Note: could use promises here to check success of sql updates (i.e. before running sql cleanup, etc)

                                            var syncResultSyncIdRegister = {};
                                            // add or update new items
                                            syncResult.forEach(function (remoteWorkout) {
                                                var localWorkout = _.findWhere(localWorkoutsArray, {sync_id: remoteWorkout.$id})
                                                syncResultSyncIdRegister[remoteWorkout.$id] = true;

                                                if (!localWorkout) {
                                                    //console.log('   > Creating new local row');
                                                    // check for undefined exercise_list to avoid errors in local dv
                                                    if (typeof remoteWorkout.exercise_list === 'undefined') {
                                                        remoteWorkout.exercise_list = '';
                                                    }
                                                    // sqlCommands.push( 'INSERT INTO Sworkit(created_on, minutes_completed, calories, type, utc_created, exercise_list) VALUES ((datetime("now","localtime")),?,?,?,datetime("now"),?)', + localWorkout.sworkit_id );
                                                    db.transaction(function (tx) {
                                                        tx.executeSql('INSERT INTO SworkitFree(sync_id, sync_lastUpdated, created_on, minutes_completed, calories, type, utc_created, exercise_list) VALUES (?,?,?,?,?,?,?,?)',
                                                            [remoteWorkout.$id, remoteWorkout.sync_lastUpdated, remoteWorkout.created_on, remoteWorkout.minutes_completed, remoteWorkout.calories, remoteWorkout.type, remoteWorkout.utc_created, remoteWorkout.exercise_list], function (tx, success) {
                                                                //console.log('success', success)
                                                            }, function (tx, error) {
                                                                console.log('error', error)
                                                            });
                                                    });
                                                } else if (localWorkout.sync_lastUpdated < remoteWorkout.sync_lastUpdated) {
                                                    //console.log('   > Updating local row', remoteWorkout.$id, remoteWorkout.sync_lastUpdated);
                                                    // check for undefined exercise_list to avoid errors in local dv
                                                    if (typeof remoteWorkout.exercise_list === 'undefined') {
                                                        remoteWorkout.exercise_list = '';
                                                    }
                                                    db.transaction(function (tx) {
                                                        tx.executeSql('UPDATE SworkitFree SET sync_lastUpdated=?, created_on=?, minutes_completed=?, calories=?, type=?, utc_created=?, exercise_list=? WHERE sync_id=?',
                                                            [remoteWorkout.sync_lastUpdated, remoteWorkout.created_on, remoteWorkout.minutes_completed, remoteWorkout.calories, remoteWorkout.type, remoteWorkout.utc_created, remoteWorkout.exercise_list, remoteWorkout.$id], function (tx, success) {
                                                                //console.log('success', success)
                                                            }, function (tx, error) {
                                                                console.warn('error', error)
                                                            });
                                                    });
                                                }
                                            });

                                            // remove any items that should no longer be in websql
                                            // 		1) rows with null value for sync_id (this is fine, because these workouts will be in syncResult array now) - (should we do this individually above before the initial INSERT so that they are actually replaced instead of a new sworkit_id being used?)
                                            // 		2) rows with sync_id not in syncResult
                                            localWorkoutsArray.forEach(function (localWorkout) {
                                                //console.log('   ',localWorkout.sync_id, _.has(syncResultSyncIdRegister, localWorkout.sync_id));
                                                if (!localWorkout.sync_id || !_.has(syncResultSyncIdRegister, localWorkout.sync_id)) {
                                                    //console.log('   > Removing local row', localWorkout);
                                                    db.transaction(function (tx) {
                                                        tx.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = ?', [localWorkout.sworkit_id], function (tx, success) {
                                                            //console.log('success', success)
                                                        }, function (tx, error) {
                                                            console.warn('error', error)
                                                        });
                                                    });
                                                }
                                            });

                                            //console.log('Sync complete', WEBSQL_WORKOUTS_LOG_KEY);

                                        });
                                }
                            }
                        }

                    });
                });

            },

            remoteDeleteWebSqlWorkoutLog: function (syncId) {

                SyncService.deleteFromArray(WEBSQL_WORKOUTS_LOG_KEY, 'sync_id', syncId, function () {
                    self.syncWebSqlWorkoutLog();
                });

            },

            updateToSyncLogLocal: function (syncId, newDate) {
                SyncService.writeSyncLogLocal(LF_CUSTOM_WORKOUTS_KEY + "." + syncId, newDate, function () {
                    localforage.setItem(LF_CUSTOM_WORKOUTS_KEY, PersonalData.GetCustomWorkouts);
                });
            }

        }
        $window.syncWebSqlWorkoutLog = self.syncWebSqlWorkoutLog;
        return self;

    });