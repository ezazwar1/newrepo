angular.module('swMobileApp').factory('UserWorkoutService', function (moment, $q, $log) {
        return {
            getWorkoutsByDate: function () {
                $log.info("getWorkoutsByDate()");
                var deferred = $q.defer();
                db.transaction(
                    function (transaction) {
                        //REMEMBER: This needs to become SworkitFree for Lite
                        transaction.executeSql("SELECT * FROM SworkitFree",
                            [],
                            function createWorkoutsByDate(tx, results) {
                                // TODO: DRY this out with ProfileCtrl.presentStats()
                                $log.info("createWorkoutsByDate()", results);
                                var allWorkouts = [];
                                var workoutsByDate = {};
                                if (results.rows.length == 0) {
                                    deferred.resolve(workoutsByDate);
                                }
                                for (var i = 0; i < results.rows.length; i++) {
                                    var workoutDate = results.rows.item(i)['created_on'].split(/[- :]/);
                                    var thisDay = new Date(workoutDate[0], workoutDate[1] - 1, workoutDate[2], 0, 0, 0, 0);
                                    thisDay = thisDay.getTime();
                                    workoutDate = new Date(workoutDate[0], workoutDate[1] - 1, workoutDate[2], workoutDate[3], workoutDate[4], workoutDate[5]);
                                    if (workoutsByDate[thisDay]) {
                                        workoutsByDate[thisDay].minutes = workoutsByDate[thisDay].minutes + results.rows.item(i)['minutes_completed'];
                                        workoutsByDate[thisDay].calories = workoutsByDate[thisDay].calories + results.rows.item(i)['calories'];
                                    } else {
                                        workoutsByDate[thisDay] = {
                                            minutes: results.rows.item(i)['minutes_completed'],
                                            calories: results.rows.item(i)['calories']
                                        }
                                    }

                                    allWorkouts.push(results.rows.item(i));
                                    allWorkouts[i].workoutDate = workoutDate;

                                    if (i == results.rows.length - 1) {
                                        allWorkouts.sort(function (a, b) {
                                            return new Date(b.workoutDate) - new Date(a.workoutDate);
                                        });
                                    }
                                    deferred.resolve(workoutsByDate);
                                }
                            }
                            ,
                            null
                        )
                    },
                    function onError(err) {
                        $log.warn("db tx onError()");
                        deferred.reject(err);
                    }
                );
                return deferred.promise;
            }
        }
    }
);
