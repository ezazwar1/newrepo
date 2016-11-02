angular.module('swMobileApp').controller('LogCtrl', function ($scope, $ionicLoading, $location, $stateParams, $translate, $ionicPlatform, $ionicPopup, $ionicListDelegate, $http, UserService, AppSyncService) {
    $ionicLoading.show({
        template: $translate.instant('LOADING_W')
    });
    $scope.noLogs = false;
    $scope.userSettings = UserService.getUserSettings();
    db.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM SworkitFree",
                [],
                $scope.createLog,
                null)
        }
    );
    $scope.createLog = function (tx, results) {
        $scope.allLogs = [];
        if (results.rows.length == 0) {
            $scope.noLogs = true;
            $ionicLoading.hide();
        }
        //TODO: Translate these months and use proper date format
        var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var totalRows = 0;
        for (var i = results.rows.length - 1; i > -1; i--) {
            var createdDate;
            var workoutDate = results.rows.item(i)['created_on'].split(/[- :]/);
            workoutDate = new Date(workoutDate[0], workoutDate[1] - 1, workoutDate[2], workoutDate[3], workoutDate[4], workoutDate[5]);
            var useID = results.rows.item(i)['sworkit_id'];
            var activityTitle = LocalData.GetWorkoutTypes[results.rows.item(i)['type']] && LocalData.GetWorkoutTypes[results.rows.item(i)['type']].activityNames ? LocalData.GetWorkoutTypes[results.rows.item(i)['type']].activityNames : 'Workout';
            var useCalories = results.rows.item(i)['calories'];
            var useMinutes = results.rows.item(i)['minutes_completed'];
            if (!device || (isUSA && $scope.userSettings.preferredLanguage == 'EN' && true)) {
                var useDate = results.rows.item(i)['created_on'].split(/[- :]/);
                createdDate = new Date(useDate[0], useDate[1] - 1, useDate[2], useDate[3], useDate[4], useDate[5]);
                var ampm = (createdDate.getHours() > 11) ? "pm" : "am";
                var useHour = (createdDate.getHours() > 12) ? createdDate.getHours() - 12 : createdDate.getHours();
                var useMinute = (createdDate.getMinutes() < 10) ? "0" + createdDate.getMinutes() : createdDate.getMinutes();
                createdDate = month_names_short[createdDate.getMonth()] + ' ' + createdDate.getDate() + ', ' + useHour + ":" + useMinute + " " + ampm;
                if (!activityTitle) {
                    activityTitle = "CUSTOM_SM";
                }
                $scope.allLogs.push({
                    'id': useID,
                    'createdDate': createdDate,
                    'useMinutes': useMinutes,
                    'activityTitle': activityTitle,
                    'useCalories': useCalories,
                    'workoutDate': workoutDate
                });
                totalRows++;
                if (totalRows = results.rows.length) {
                    $ionicLoading.hide();
                }
            } else {
                var useDate = results.rows.item(i)['created_on'].split(/[- :]/);
                useDate = new Date(useDate[0], useDate[1] - 1, useDate[2], useDate[3], useDate[4], useDate[5]);
                if (!activityTitle) {
                    activityTitle = "Workout";
                }
                $scope.allLogs.push({
                    'id': useID,
                    'createdDate': useDate.toLocaleString(),
                    'useMinutes': useMinutes,
                    'activityTitle': activityTitle,
                    'useCalories': useCalories,
                    'workoutDate': workoutDate
                });
                totalRows++;
                if (totalRows = results.rows.length) {
                    $ionicLoading.hide();
                }
            }
            if (i == 0) {
                $scope.allLogs.sort(function (a, b) {
                    return new Date(b.workoutDate) - new Date(a.workoutDate);
                });
            }
        }

    };
    $scope.syncRow = function (rowId) {
        db.transaction(function (transaction) {
            transaction.executeSql('SELECT * FROM SworkitFree WHERE sworkit_id = ?', [rowId],
                function (tx, results) {
                    var syncableWorkout = results.rows.item(0);
                    var dateString = syncableWorkout["utc_created"];
                    var actionString = "log_cardio_exercise";
                    var accessString = PersonalData.GetUserSettings.mfpAccessToken;
                    var appID = "79656b6e6f6d";
                    var exerciseID = LocalData.GetWorkoutTypes[syncableWorkout["type"]] && LocalData.GetWorkoutTypes[syncableWorkout["type"]].activityMFP ? LocalData.GetWorkoutTypes[syncableWorkout["type"]].activityMFP : '134026252709869';
                    var durationFloat = syncableWorkout["minutes_completed"] * 60000;
                    var energyCalories = syncableWorkout["calories"];
                    var unitCountry = "US";
                    var statusMessage = "burned %CALORIES% calories doing %QUANTITY% minutes of " + $translate.instant(LocalData.GetWorkoutTypes[results.rows.item(0).type] && LocalData.GetWorkoutTypes[results.rows.item(0).type].activityNames ? LocalData.GetWorkoutTypes[results.rows.item(0).type].activityNames : 'BG_WORKOUT') + " with Sworkit";
                    var dataPost = JSON.stringify({
                        'action': actionString,
                        'access_token': accessString,
                        'app_id': appID,
                        'exercise_id': exerciseID,
                        'duration': durationFloat,
                        'energy_expended': energyCalories,
                        'start_time': dateString,
                        'status_update_message': statusMessage,
                        'units': unitCountry
                    });
                    $http({
                        method: 'POST',
                        url: 'https://www.myfitnesspal.com/client_api/json/1.0.0?client_id=sworkit',
                        data: dataPost,
                        headers: {'Content-Type': 'application/json'}
                    })
                        .then(function (resp) {
                            showNotification('Successly logged to MyFitnessPal', 'button-calm', 2000);
                        }, function (err) {
                            if ($scope) {
                                showNotification('Unable to log to MyFitnessPal', 'button-assertive', 2000);
                            }
                        })
                },
                null);
        });
    };
    $scope.deleteRow = function (rowId) {
        if (device) {
            navigator.notification.confirm(
                'Are you sure you want to delete this workout?',
                function (buttonIndex) {
                    if (buttonIndex == 2) {
                        doDeleteWorkout(rowId);
                        $ionicListDelegate.closeOptionButtons();
                    }
                },
                'Delete Workout',
                ['Cancel', 'Delete']
            );
        } else {
            $ionicPopup.confirm({
                    title: 'Delete Workout',
                    template: '<p class="padding">Are you sure you want to delete this workout?</p>',
                    okType: 'assertive',
                    okText: 'Delete'
                })
                .then(function (res) {
                    if (res) {
                        doDeleteWorkout(rowId);
                        $ionicListDelegate.closeOptionButtons();
                    }
                });
        }
    };

    function doDeleteWorkout(rowId) {
        db.transaction(function (transaction) {
            transaction.executeSql('SELECT * FROM SworkitFree WHERE sworkit_id = ?', [rowId], function (tx, results) {
                if (!results.rows || !results.rows.item(0)) {
                    // alert('Unexpected error', rowId);  // todo: for debugging, either remove after testing, or handle error if necessary
                    console.error('Unexpected error', rowId, results);
                    return;
                }
                var syncId = results.rows.item(0).sync_id;

                // delete locally
                db.transaction(function (transaction) {
                    transaction.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = ?', [rowId]);
                });
                $scope.allLogs.forEach(function (element, index, array) {
                    if (element.id == rowId) {
                        $scope.allLogs.splice(index, 1);
                    }
                });
                $scope.$apply();

                // delete remotely
                AppSyncService.remoteDeleteWebSqlWorkoutLog(syncId);

            });
        });
        return

    }
});
