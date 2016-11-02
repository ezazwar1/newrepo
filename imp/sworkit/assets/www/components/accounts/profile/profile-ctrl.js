angular.module('swMobileApp').controller('ProfileCtrl', function ($scope, $state, $ionicModal, $ionicPopup, $cordovaCamera, $translate, $location, $rootScope, $ionicActionSheet, $q, $timeout, FirebaseService, AppSyncService, AchievementService, WorkoutService, AccessService, AccountsService, $window, $log) {

    $scope.init = function () {
        $scope.user = PersonalData.GetUserProfile;
        if (!$scope.user.uid || $scope.user.uid !== FirebaseService.getUserUID()) {
            $scope.user.uid = FirebaseService.getUserUID();
        }
        $scope.userSettings = PersonalData.GetUserSettings;

        $scope.toggle = {
            showGoals: false
        };

        $scope.goalList = [
            {short: "GOAL_HEALTH", checked: false},
            {short: "GOAL_LOSE", checked: false},
            {short: "GOAL_BUILD", checked: false},
            {short: "GOAL_TONE", checked: false},
            {short: "GOAL_SPORTS", checked: false},
            {short: "GOAL_FLEXIBILITY", checked: false},
            {short: "GOAL_INJURY", checked: false}
        ];

        $scope.updateCheckedGoals();

        $scope.goldStatus = 30;
        $scope.silverStatus = 15;
        $scope.bronzeStatus = 5;

        $scope.listOptions = [
            {text: $translate.instant('ALLTIME'), value: "all"},
            {text: $translate.instant('TODAY'), value: "today"},
            {text: $translate.instant('THISWEEK'), value: "week"},
            {text: $translate.instant('PAST30'), value: "month"}
        ];

        $scope.optionSelected = {
            listType: 'all'
        };

        $scope.show_hidden_actions = false;
        $scope.updateStats();
        $scope.resetData();

        AccessService.isActiveSubscription()
            .then(function (isActiveSubscription) {
                $timeout(function () {
                    $scope.isActiveSubscription = isActiveSubscription;
                })
            });

        AccessService.isLegacyPro()
            .then(function (isLegacyPro) {
                $timeout(function () {
                    $scope.isLegacyPro = isLegacyPro;
                })
            });
    };

    $scope.toggleHiddenActions = function () {
        $scope.show_hidden_actions = !$scope.show_hidden_actions;
    };

    $scope.handleLogOutData = function () {
        $ionicPopup.confirm({
            title: $translate.instant('WORKOUT_LOG'),
            template: '<p class="centered">' + $translate.instant("WHATLOG") + '</p>',
            okType: 'energized',
            okText: $translate.instant("KEEPDEVICE"),
            cancelText: $translate.instant("RMDEVICE")
        })
            .then(function (res) {
                if (!res) {
                    $scope.removeWorkoutLogs();
                }
                AccountsService.logOut();
                $state.go('app.welcome');
                $scope.hideEditProfile();
            });
    };

    $scope.logOut = function () {
        $ionicPopup.confirm({
            title: $translate.instant('LOGOUTQ'),
            template: '<p class="centered">' + $translate.instant('SURELOGOUT') + '</p>',
            okType: 'energized',
            okText: $translate.instant('OK'),
            cancelText: $translate.instant('CANCEL_SM')
        })
            .then(function (res) {
                if (res) {
                    $timeout(function () {
                        $scope.handleLogOutData();
                    }, 500)
                }
            });
    };

    $scope.removeWorkoutLogs = function () {
        var deleteLog = function (tx, results) {
            for (var i = 0; i < results.rows.length; i++) {
                $scope.deleteMaxLog();
            }
        };
        db.transaction(
            function (transaction) {
                //REMEMBER: This needs to become SworkitFree for Lite
                transaction.executeSql("SELECT * FROM SworkitFree",
                    [],
                    deleteLog,
                    null)
            }
        );
    };

    $scope.deleteMaxLog = function () {
        //REMEMBER: This needs to become SworkitFree for Lite
        window.db.transaction(function (transaction) {
            transaction.executeSql('DELETE FROM SworkitFree WHERE sworkit_id = (SELECT MAX(sworkit_id) FROM SworkitFree)');
        });
    };

    $scope.changePhoto = function () {
        if (device && device.platform.toLowerCase() == 'ios') {
            $timeout(function () {
                $ionicActionSheet.show({
                    buttons: [
                        {text: $translate.instant("TAKEPHOTO")},
                        {text: $translate.instant("CHOOSEPHOTO")}
                    ],
                    cancelText: $translate.instant("CANCEL_SM"),
                    buttonClicked: function (indexNum) {
                        $scope.upload(indexNum);
                        return true;
                    },
                    cancel: function () {
                        return true;
                    }
                });
            }, 200);
        } else {
            $scope.actionPopup = $ionicPopup.show({
                title: '',
                subTitle: '',
                scope: $scope,
                template: '<div class="action-button" style="padding-bottom:10px"><button class="button button-full button-stable" ng-click="upload(0)">' + $translate.instant("TAKEPHOTO") + '</button><button class="button button-full button-stable" ng-click="upload(1)">' + $translate.instant("CHOOSEPHOTO") + '</button><button class="button button-full button-stable cancel-button" ng-click="popupClose()" >{{"CANCEL_SM" | translate}}</button></div>'
            });
        }
    };

    $scope.upload = function (source) {
        if ($scope.actionPopup) {
            $scope.actionPopup.close();
        }

        if (source == 1) {
            var pictureSource = Camera.PictureSourceType.PHOTOLIBRARY
        } else {
            var pictureSource = Camera.PictureSourceType.CAMERA;
        }

        if (device) {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: pictureSource,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 200,
                targetHeight: 200,
                cameraDirection: 1,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options)
                .then(function (imageData) {
                    PersonalData.GetUserProfile.photo = "data:image/jpeg;base64," + imageData;
                    $scope.user.photo = PersonalData.GetUserProfile.photo;
                }, function (error) {
                    console.error(error);
                });
        }
    };

    $scope.popupClose = function () {
        $scope.actionPopup.close();
    };

    $scope.updateStats = function () {

        $scope.recentWorkouts = [];

        $scope.displayStats = {
            averageDuration: 0,
            totalSessions: 0,
            totalMinutes: 0,
            totalCalories: 0,
            goldCount: 0,
            silverCount: 0,
            bronzeCount: 0
        };

        $scope.statsTotal = {
            averageDuration: 0,
            totalSessions: 0,
            totalMinutes: 0,
            totalCalories: 0,
            goldCount: 0,
            silverCount: 0,
            bronzeCount: 0
        };

        $scope.stats30 = {
            averageDuration: 0,
            totalSessions: 0,
            totalMinutes: 0,
            totalCalories: 0,
            goldCount: 0,
            silverCount: 0,
            bronzeCount: 0
        };

        $scope.stats7 = {
            averageDuration: 0,
            totalSessions: 0,
            totalMinutes: 0,
            totalCalories: 0,
            goldCount: 0,
            silverCount: 0,
            bronzeCount: 0
        };

        $scope.statsToday = {
            averageDuration: 0,
            totalSessions: 0,
            totalMinutes: 0,
            totalCalories: 0,
            goldCount: 0,
            silverCount: 0,
            bronzeCount: 0
        };

        $window.db.transaction(
            function (transaction) {
                //REMEMBER: This needs to become SworkitFree for Lite
                transaction.executeSql("SELECT * FROM SworkitFree",
                    [],
                    presentStats,
                    null)
            }
        );
        function presentStats(tx, results) {
            var todayOnly = $scope.getToday();
            var thisWeek = AchievementService.getWeekStart(todayOnly);
            var thirtyDaysPast = $scope.getPastDate(30);
            var allWorkouts = [];
            var workoutsByDate = {};
            var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (var i = 0; i < results.rows.length; i++) {
                var workoutDate = results.rows.item(i)['created_on'].split(/[- :]/);
                var thisDay = new Date(workoutDate[0], workoutDate[1] - 1, workoutDate[2], 0, 0, 0, 0);
                thisDay = thisDay.getTime();
                workoutDate = new Date(workoutDate[0], workoutDate[1] - 1, workoutDate[2], workoutDate[3], workoutDate[4], workoutDate[5]);
                if (workoutsByDate[thisDay]) {
                    workoutsByDate[thisDay].minutes = workoutsByDate[thisDay].minutes + results.rows.item(i)['minutes_completed'];
                    workoutsByDate[thisDay].calories = workoutsByDate[thisDay].calories + results.rows.item(i)['calories']
                } else {
                    workoutsByDate[thisDay] = {
                        minutes: results.rows.item(i)['minutes_completed'],
                        calories: results.rows.item(i)['calories']
                    }
                }

                allWorkouts.push(results.rows.item(i));
                allWorkouts[i].workoutDate = workoutDate;

                if (thisDay === todayOnly.getTime()) {
                    $scope.statsToday.totalSessions++;
                }
                if (workoutDate.getTime() >= thisWeek.getTime()) {
                    $scope.stats7.totalSessions++;
                }
                if (workoutDate.getTime() >= thirtyDaysPast.getTime()) {
                    $scope.stats30.totalSessions++;
                }
                $scope.statsTotal.totalSessions++;

                if (i == results.rows.length - 1) {
                    allWorkouts.sort(function (a, b) {
                        return new Date(b.workoutDate) - new Date(a.workoutDate);
                    });
                    createStats();
                    $scope.streakCount = AchievementService.getStreakCount(workoutsByDate, todayOnly);
                }
            }

            function createStats() {
                _.each(workoutsByDate, function (statValues, dateKey) {
                    //console.log(dateKey)
                    //console.log(todayOnly.getTime())
                    if (dateKey >= todayOnly.getTime()) {
                        $scope.statsToday.totalMinutes += statValues.minutes;
                        $scope.statsToday.totalCalories += statValues.calories;
                        if (statValues.minutes >= $scope.goldStatus) {
                            $scope.statsToday.goldCount++;
                        } else if (statValues.minutes >= $scope.silverStatus) {
                            $scope.statsToday.silverCount++;
                        } else if (statValues.minutes >= $scope.bronzeStatus) {
                            $scope.statsToday.bronzeCount++;
                        }
                    }
                    if (dateKey >= thisWeek.getTime()) {
                        $scope.stats7.totalMinutes += statValues.minutes;
                        $scope.stats7.totalCalories += statValues.calories;
                        if (statValues.minutes >= $scope.goldStatus) {
                            $scope.stats7.goldCount++;
                        } else if (statValues.minutes >= $scope.silverStatus) {
                            $scope.stats7.silverCount++;
                        } else if (statValues.minutes >= $scope.bronzeStatus) {
                            $scope.stats7.bronzeCount++;
                        }
                    }
                    if (dateKey >= thirtyDaysPast.getTime()) {
                        $scope.stats30.totalMinutes += statValues.minutes;
                        $scope.stats30.totalCalories += statValues.calories;
                        if (statValues.minutes >= $scope.goldStatus) {
                            $scope.stats30.goldCount++;
                        } else if (statValues.minutes >= $scope.silverStatus) {
                            $scope.stats30.silverCount++;
                        } else if (statValues.minutes >= $scope.bronzeStatus) {
                            $scope.stats30.bronzeCount++;
                        }
                    }
                    $scope.statsTotal.totalMinutes += statValues.minutes;
                    $scope.statsTotal.totalCalories += statValues.calories;
                    if (statValues.minutes >= $scope.goldStatus) {
                        $scope.statsTotal.goldCount++;
                    } else if (statValues.minutes >= $scope.silverStatus) {
                        $scope.statsTotal.silverCount++;
                    } else if (statValues.minutes >= $scope.bronzeStatus) {
                        $scope.statsTotal.bronzeCount++;
                    }
                }, function (err) {

                });

                $scope.statsToday.averageDuration = Math.round($scope.statsToday.totalMinutes / $scope.statsToday.totalSessions);
                $scope.stats7.averageDuration = Math.round($scope.stats7.totalMinutes / $scope.stats7.totalSessions);
                $scope.stats30.averageDuration = Math.round($scope.stats30.totalMinutes / $scope.stats30.totalSessions);
                $scope.statsTotal.averageDuration = Math.round($scope.statsTotal.totalMinutes / $scope.statsTotal.totalSessions);
                $scope.setDisplayedStats('all');

                var numRecentWorkouts = allWorkouts.length > 3 ? 3 : allWorkouts.length;
                LocalData.GetWorkoutTypes.customWorkout.activityNames = 'CUSTOM_SM';
                for (var wkout = 0; wkout < numRecentWorkouts; wkout++) {
                    $scope.recentWorkouts.push(allWorkouts[wkout]);
                    $scope.recentWorkouts[wkout].typeName = LocalData.GetWorkoutTypes[allWorkouts[wkout]['type']] && LocalData.GetWorkoutTypes[allWorkouts[wkout]['type']].activityNames ? LocalData.GetWorkoutTypes[allWorkouts[wkout]['type']].activityNames : LocalData.GetWorkoutTypes['customWorkout'].activityNames;

                    if (!device || (isUSA && $scope.userSettings.preferredLanguage == 'EN' && true)) {
                        var useDate = allWorkouts[wkout]['created_on'].split(/[- :]/);
                        createdDate = new Date(useDate[0], useDate[1] - 1, useDate[2], useDate[3], useDate[4], useDate[5]);
                        var ampm = (createdDate.getHours() > 11) ? "pm" : "am";
                        var useHour = (createdDate.getHours() > 12) ? createdDate.getHours() - 12 : createdDate.getHours();
                        var useMinute = (createdDate.getMinutes() < 10) ? "0" + createdDate.getMinutes() : createdDate.getMinutes();
                        createdDate = month_names_short[createdDate.getMonth()] + ' ' + createdDate.getDate() + ', ' + useHour + ":" + useMinute + " " + ampm;
                        $scope.recentWorkouts[wkout].created_on = createdDate;
                    } else {
                        var useDate = results.rows.item(i)['created_on'].split(/[- :]/);
                        useDate = new Date(useDate[0], useDate[1] - 1, useDate[2], useDate[3], useDate[4], useDate[5]);
                        $scope.recentWorkouts[wkout].created_on = useDate;
                    }
                    if (!LocalData.GetWorkoutTypes[results.rows.item(i)['type']] || !LocalData.GetWorkoutTypes[results.rows.item(i)['type']].activityNames) {
                        $scope.recentWorkouts[wkout].typeName = $translate.instant('CUSTOM_SM');
                    }

                    var wt = $scope.recentWorkouts[wkout].typeName;
                    if (wt == 'FULL' || wt == 'UPPER' || wt == 'CORE' || wt == 'LOWER' || wt == 'SEVEN_MINUTE' || wt == 'RUMP' || wt == 'QUICK' || wt == 'LOWUPPER' || wt == 'LOWLOWER') {
                        $scope.recentWorkouts[wkout].background = 'strength-color.jpg';
                        $scope.recentWorkouts[wkout].goToLocation = 'app.workout-length({ categoryId: 0, typeId:"' + $scope.recentWorkouts[0].type + '"})';
                    } else if (wt == 'CARDIO_LIGHT' || wt == 'CARDIO_FULL' || wt == 'PLYOMETRICS' || wt == 'BRING_PAIN' || wt == 'BOOT_CAMP' || wt == 'LOWCARDIO') {
                        $scope.recentWorkouts[wkout].background = 'cardio-color.jpg';
                        $scope.recentWorkouts[wkout].goToLocation = 'app.workout-length({ categoryId: 1, typeId:"' + $scope.recentWorkouts[0].type + '"})';
                    } else if (wt == 'SUN_SALUTATION' || wt == 'FULL_SEQ' || wt == 'RUNNER_YOGA' || wt == 'PILATES') {
                        $scope.recentWorkouts[wkout].background = 'yoga-color.jpg';
                        $scope.recentWorkouts[wkout].goToLocation = 'app.workout-length({ categoryId: 2, typeId:"' + $scope.recentWorkouts[0].type + '"})';
                    } else if (wt == 'HEAD_TOE' || wt == 'STRETCH' || wt == 'STANDING' || wt == 'BACK_STRENGTH' || wt == 'OFFICE' || wt == 'ANYTHING' || wt == 'LOWFLEXIBILITY') {
                        $scope.recentWorkouts[wkout].background = 'stretch-color.jpg';
                        $scope.recentWorkouts[wkout].goToLocation = 'app.workout-length({ categoryId: 3, typeId:"' + $scope.recentWorkouts[0].type + '"})';
                    } else {
                        $scope.recentWorkouts[wkout].background = 'cardio-dark.jpg';
                        $scope.recentWorkouts[wkout].goToLocation = 'app.workout-custom'
                    }

                }

            }

        }

    };

    $scope.setDisplayedStats = function (statsSelected) {
        if (statsSelected == 'today') {
            $scope.displayStats = $scope.statsToday;
        } else if (statsSelected == 'week') {
            $scope.displayStats = $scope.stats7;
        } else if (statsSelected == 'month') {
            $scope.displayStats = $scope.stats30;
        } else {
            $scope.displayStats = $scope.statsTotal;
        }
    };

    $scope.getToday = function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    $scope.getPastDate = function (numDays) {
        var date = new Date();
        var last = new Date(date.getTime() - (numDays * 24 * 60 * 60 * 1000));
        var lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate());
        return lastMidnight;
    };

    $ionicModal.fromTemplateUrl('components/accounts/profile/partials/edit-profile.html', {
        scope: $scope,
        animation: 'slide-in-up'
    })
        .then(function (modal) {
            $scope.edit_profile_modal = modal;
        });

    $ionicModal.fromTemplateUrl('components/accounts/login/partials/change-password.html', {
        scope: $scope,
        animation: 'slide-in-up'
    })
        .then(function (modal) {
            $scope.change_password_modal = modal;
        });

    $ionicModal.fromTemplateUrl('components/accounts/login/partials/change-email.html', {
        scope: $scope,
        animation: 'slide-in-up'
    })
        .then(function (modal) {
            $scope.change_email_modal = modal;
        });

    $scope.showEditProfile = function () {
        $scope.edit_profile_modal.show();
        $scope.userClone = cloneObject($scope.user);
        $scope.updateCheckedGoals();
        if (device) cordova.plugins.Keyboard.disableScroll(true);
        if ($scope.user.groupCode) {
            FirebaseService.groupsRef.child($scope.user.groupCode).on('value', function (snapshot) {
                $scope.group = snapshot.val();
            });
        }
    };

    $scope.hideEditProfile = function () {
        $scope.edit_profile_modal.hide();
        if (device) cordova.plugins.Keyboard.disableScroll(false);
    };

    $scope.cancelEdit = function () {
        if ($scope.user.authType !== "email") {
            $scope.user.email = $scope.userClone.email;
        }

        $scope.user.birthYear = $scope.userClone.birthYear;
        $scope.user.gender = $scope.userClone.gender;
        $scope.user.goals = $scope.userClone.goals;
        $scope.user.firstName = $scope.userClone.firstName;
        $scope.user.lastName = $scope.userClone.lastName;
        $scope.user.photo = $scope.userClone.photo;

        $scope.hideEditProfile();
    };

    $scope.saveProfileEdit = function (signUpForm, shouldKeepOpen) {
        if (signUpForm.$valid) {
            $scope.getGoals($scope.goalList, function () {
                PersonalData.GetUserProfile = $scope.user;
                persistMultipleObjects($q, {
                    'userProfile': PersonalData.GetUserProfile
                }, function () {
                    AppSyncService.syncStoredData();
                });
                if (!shouldKeepOpen) {
                    $scope.hideEditProfile();
                }
            });
        } else {
            signUpForm.submitted = true;
            console.log('Profile Data Invalid');
        }
    };

    $scope.changePassword = function () {
        $scope.change_password_modal.show();
    };

    $scope.cancelChangePassword = function () {
        $scope.resetData();
        $scope.change_password_modal.hide();
    };

    $scope.cancelPasswordEmail = function () {
        $scope.resetData();
        $scope.change_password_modal.hide();
    };

    $scope.forgotPassword = function () {
        $scope.hideEditProfile();
        $scope.change_password_modal.hide();
        $location.path('/app/auth/forgot-password');
    };

    $scope.enterGroupCode = function () {
        $ionicPopup.prompt({
            title: $translate.instant('ENTER_GROUP'),
            cancelText: $translate.instant('CANCEL_SM'),
            inputType: 'text',
            template: '<input ng-model="data.response" type="text" autofocus class="ng-pristine ng-valid" autocapitalize="off" autocorrect="off">',
            inputPlaceholder: '',
            okText: $translate.instant('OK'),
            okType: 'energized'
        })
            .then(function (code) {
                if (code && code.length > 1) {
                    $scope.groupClass = "assertive";
                    FirebaseService.groupsRef.child(code).on('value', function (snapshot) {
                        var group = snapshot.val();
                        if (group && group.active) {
                            $scope.group = group;
                            PersonalData.GetUserProfile.groupCode = code;
                            persistMultipleObjects($q, {
                                'userProfile': PersonalData.GetUserProfile
                            }, function () {
                                AppSyncService.syncLocalForageObject('userProfile', ['groupCode'], PersonalData.GetUserProfile);
                                // TODO: Should we only do the following after promise returned from syncLocalForageObject?
                                $scope.groupClass = "balanced";
                                $scope.groupMessage = group.organization + " " + $translate.instant('GROUPACCEPT');
                                AccessService.refreshCache();
                                AccessService.setGroupPro(true, code);
                                $scope.isActiveSubscription = true;
                                WorkoutService.unlockForGroupPro()
                                    .then(function () {
                                        var timeoutForWhat = 2000;
                                        showNotification($translate.instant('GROUPACCEPT'), 'button-energized', timeoutForWhat);
                                    })
                                    .then(WorkoutService.manageDownloads);
                            });

                        } else {
                            $scope.groupMessage = $translate.instant('GROUPINVALID');
                        }
                    }, function (error) {
                        $scope.groupMessage = $translate.instant('GROUPINVALID');
                    });
                } else {
                    $scope.groupMessage = $translate.instant('GROUPINVALID');
                }
            });
    };

    $scope.leaveGroup = function () {
        $ionicPopup.confirm({
            title: 'Leave Group',
            template: '<p class="padding">Are you sure you want to leave ' + $scope.group.organization + '?</p>',
            okType: 'assertive',
            okText: 'Leave'
        })
            .then(function (res) {
                if (res) {
                    FirebaseService.ref.child($scope.user.uid + '/userProfile/groupCode').remove(function (error) {
                        if (error) {
                            $scope.groupMessage = $translate.instant('Action Unsuccessful');
                        } else {
                            $scope.groupMessage = null;
                            $scope.user.groupCode = null;
                            persistMultipleObjects($q, {
                                'userProfile': PersonalData.GetUserProfile
                            }, function () {
                                AppSyncService.syncLocalForageObject('userProfile', ['groupCode'], null);
                                WorkoutService.lockForGroupCodeRemove()
                                    .then(function () {
                                        AccessService.setGroupPro(null);
                                        AccessService.refreshCache();
                                        showNotification('Group access removed', 'button-energized', 2000);
                                        AccessService.isActiveSubscription()
                                            .then(function (isActiveSubscription) {
                                                $timeout(function () {
                                                    $scope.isActiveSubscription = isActiveSubscription;
                                                })
                                            });
                                    });
                            })
                        }
                    });
                }
            });
    };

    $scope.confirmPasswordChange = function (passwordForm) {
        passwordForm.submitted = true;
        if (!passwordForm.password.$invalid && !passwordForm.newPassword.$invalid) {
            $scope.data.loading = true;
            FirebaseService.ref.changePassword({
                email: $scope.user.email,
                oldPassword: $scope.data.password,
                newPassword: $scope.data.newPassword
            }, function (error) {
                if (error) {
                    if (error.code == "INVALID_PASSWORD") {
                        $scope.data.incorrectPassword = true;
                    } else {
                        $scope.data.errorMessage = $translate.instant(error.code);
                    }
                    console.error("Error: ", error);
                    $scope.data.loading = false;
                } else {
                    $scope.data.errorMessage = false;
                    $scope.data.incorrectPassword = false;
                    $scope.cancelPasswordEmail();
                    $scope.data.loading = false;
                }
            })
        }
    };

    $scope.changeEmail = function () {
        $scope.change_email_modal.show();
    };

    $scope.cancelChangeEmail = function () {
        $scope.resetData();
        $scope.change_email_modal.hide();
    };

    $scope.confirmEmailChange = function (emailForm) {
        emailForm.submitted = true;
        if (!$scope.data.password.$invalid && !emailForm.newEmail.$invalid) {
            $scope.data.loading = true;
            FirebaseService.auth.$changeEmail({
                oldEmail: $scope.user.email,
                newEmail: $scope.data.newEmail,
                password: $scope.data.password
            })
                .then(function () {
                    $scope.data.errorMessage = false;
                    $scope.user.email = $scope.data.newEmail;
                    PersonalData.GetUserProfile.email = $scope.data.newEmail;
                    $scope.cancelChangeEmail();
                    $scope.data.loading = false;
                })
                .catch(function (error) {
                    console.error("Error: ", error);
                    $scope.data.errorMessage = $translate.instant(error.code);
                    $scope.data.loading = false;
                });
        }
    };

    $scope.refreshData = function () {
        AppSyncService.syncStoredData();
        AppSyncService.syncWebSqlWorkoutLog();
        AppSyncService.syncLocalForageCustomWorkouts();
        //TODO: Full stats update may be overkill, can we do this smarter?
        //TODO URGENT: replace this timeout with a promise from AppSyncService
        $timeout(function () {
            $scope.updateStats();
            $scope.optionSelected.listType = 'all';
            $scope.$broadcast('scroll.refreshComplete');
        }, 2000)
    };

    $scope.resetData = function () {
        $scope.data = {
            errorMessage: false,
            newEmail: '',
            password: '',
            newPassword: '',
            loading: false
        }
    };

    $scope.getGoals = function (goalArray, callback) {
        // TODO: This promise usage needs refactored
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function () {
            $scope.user.goals = [];
            angular.forEach(goalArray, function (value) {
                if (value.checked) {
                    $scope.user.goals.push(value.short);
                }
            });
        })
            .then(function () {
                callback();
            });
        deferred.resolve();
    };

    $scope.updateCheckedGoals = function () {
        angular.forEach($scope.user.goals, function (value) {
            angular.forEach($scope.goalList, function (_value) {
                if (_value.short == value) {
                    _value.checked = true;
                }
            });
        });
    };

    $scope.showProgress = function () {
        $location.path('/app/progress');
    };

    $scope.$on('$ionicView.leave', function () {
        $scope.change_email_modal.remove();
        $scope.change_password_modal.remove();
        $scope.edit_profile_modal.remove();
    });

    $scope.init();

});
