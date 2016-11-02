angular.module('swMobileApp').run(function ($rootScope, $timeout, $http, $ionicPlatform, $ionicPopup, $location, $translate, $state, $ionicHistory, AppSyncService, FirebaseService, AccessService, WorkoutService, $window, swAnalytics, $log) {
    $ionicPlatform.ready()
        .then(function () {
            if (!ionic.Platform.isWebView()) {
                $window.device = false;
            }

            var isFirstLaunch = !$window.localStorage.getItem('firstUse');
            if (isFirstLaunch) {
                setupNewUser($translate, $log);
            } else if ($window.localStorage.getItem('refreshUpdated') === null) {
                convertUser($window, $log);
            } else {
                if (ionic.Platform.isIOS()) {
                    migrateData($rootScope, $translate, $timeout, AppSyncService, AccessService, FirebaseService, $window, $log);
                } else {
                    loadStoredData($translate, AppSyncService, FirebaseService, AccessService, $window);
                }
            }
            if ($window.localStorage.getItem('showWelcome') === null) {
                $location.path('/app/auth/welcome');
                $window.localStorage.setItem('showWelcome', true);
                $rootScope.showWelcome = true;
            } else {
                $rootScope.showWelcome = false;
            }
            try {
                if (navigator && navigator.splashscreen && device.platform.toLowerCase() !== 'android') {
                    $timeout(function () {
                        navigator.splashscreen.hide();
                    }, 500);
                    //Just in case :)
                    $timeout(function () {
                        navigator.splashscreen.hide();
                    }, 1200);
                }
            }
            catch (e) {
            }

            //Setup Extra data like weekly stats
            setupExtraData($http);
            //Download custom workouts
            getDownloadableWorkouts($http);
            //Setup Workout Database
            setupDatabase();
            $timeout(function () {
                if (!$window.db) {
                    setupDatabase();
                }
            }, 3000);

            var timeToWaitSoPersonalDataGetUserSettingsPreferredLanguageMightBeSet = 1000;
            $timeout(function () {
                getSworkitAds($http, false);
            }, timeToWaitSoPersonalDataGetUserSettingsPreferredLanguageMightBeSet);

            swAnalytics.init(isFirstLaunch);
            initializeSessionM($window, $rootScope, $timeout, $log);

            if ($window.device) {
                $timeout(function () {
                    setWelcomeAudio();
                }, 1000);
                $window.facebookConnectPlugin.activateApp(function(success) {
                    $log.info('facebookConnectPlugin activated', success);
                }, function(failure) {
                    $log.warn('facebookConnectPlugin failed to activate', failure);
                });
            }

            if (ionic.Platform.isAndroid()) {
                $ionicPlatform.registerBackButtonAction(
                    function () {
                        var isDrawerOpen = angular.element(document.getElementsByTagName('body')[0]).hasClass('drawer-open');
                        var isHome = ($state.current.name == 'app.home');
                        var tempURL = $location.$$url.substring(0, 9);
                        if (isDrawerOpen) {
                            $rootScope.toggleDrawerRoot();
                        } else if (isHome) {
                            navigator.Backbutton.goBack(function() {
                                console.log('success')
                            }, function() {
                                console.log('fail')
                            });
                        } else if (tempURL == '/app/cust' && $state.current.name == 'app.workout-custom2') {
                            $state.go('app.workout-custom');
                        } else if (tempURL == '/app/home') {
                            $ionicHistory.backView().go();
                        } else if ($state.current.name == 'app.log') {
                            $state.go('app.profile');
                        } else if ($state.current.name == 'app.progress') {
                            $state.go('app.profile');
                        } else if (tempURL == '/app/swor' && $ionicHistory.backView() !== null) {
                            $ionicHistory.backView().go();
                        } else if (tempURL == '/app/sett' && $state.current.name == 'app.settings-audio') {
                            $ionicHistory.backView().go();
                        } else {
                            $state.go('app.home');
                        }
                    }, 180
                );
                document.addEventListener("resume", onResume, false);
                document.addEventListener("pause", onPause, false);
            }
            if (ionic.Platform.isIOS() && device) {
                $window.plugins.sworkitapplewatch.initWatchTranslations(
                    {
                        'intro': $translate.instant('CHOOSEWATCH'),
                        'congrats': $translate.instant('CONGRATS'),
                        'bpm': $translate.instant('BPM'),
                        'avgbpm': $translate.instant('AVGBPM'),
                        'peakbpm': $translate.instant('PEAKBPM'),
                        'minutes': $translate.instant('MINUTES_BG'),
                        'calories': $translate.instant('CALORIES_BG')
                    }
                );

                document.addEventListener("resume", onResumeIOS, false);
            } else if (ionic.Platform.isAndroid() && device) {
                appAvailability.check(
                    'com.nexercise.client.android',
                    function () {
                        nexerciseInstalledGlobal.status = true;
                    },
                    function () {
                        nexerciseInstalledGlobal.status = false;
                    }
                );
                lowerAndroidGlobal = ionic.Platform.version() < 4.1;
            }
            if (lockOrientation() && device) {
                try {
                    cordova.plugins.screenorientation.lockOrientation('portrait');
                } catch (e) {
                    screen.lockOrientation('portrait');
                }
            }
        });
});

var nexerciseInstalledGlobal = {status: false};
var lowerAndroidGlobal = {status: false};
var globalExternal = false;
var globalRateOption = false;
var globalShareOption = 0;
var globalRemindOption = false;
var globalNew310Option = false;
var globalFirstOption = false;
var isUSA = true;
var welcomeLoaded = false;
var globalFirstWorkout = true;
var globalFirstLoad = true;

var openURLUsed = false;
function handleOpenURL(url) {
    console.log('handleOpenURL for: ', url);
    if (!openURLUsed) {
        openURLUsed = true;
        window.setTimeout(function () {
            var body = document.getElementsByTagName("body")[0];
            var appLaunchedController = angular.element(body).scope();
            appLaunchedController.callCustom(url);
            openURLUsed = false;
        }, 2000);
    }
}

function setupNewUser($translate, $log) {
    $log.info("setupNewUser()");
    window.localStorage.setItem('firstUse', 30);
    window.localStorage.setItem('timesUsed', 1);
    window.localStorage.setItem('refreshUpdated', true);
    localforage.setItem('timingSettings', TimingData.GetTimingSettings);
    localforage.setItem('timingSevenSettings', TimingData.GetSevenMinuteSettings);
    localforage.setItem('reminder', {
        daily: {status: false, time: 7, minutes: 0},
        inactivity: {frequency: 2, status: false, time: 7, minutes: 0}
    });
    LocalData.SetReminder = {
        daily: {status: false, time: 7, minutes: 0},
        inactivity: {frequency: 2, status: false, time: 7, minutes: 0}
    };
    if (navigator.globalization) {
        navigator.globalization.getPreferredLanguage(
            function (resultLang) {
                var returnLang = 'EN';
                var twoLetterISO = resultLang.value.substring(0, 2).toUpperCase();
                if (twoLetterISO == 'ES' && resultLang.value.length > 2) {
                    returnLang = 'ESLA';
                } else if (twoLetterISO == 'DE' || twoLetterISO == 'RU' || twoLetterISO == 'TR' || twoLetterISO == 'FR' || twoLetterISO == 'PT' || twoLetterISO == 'IT' || twoLetterISO == 'ES' || twoLetterISO == 'HI' || twoLetterISO == 'JA' || twoLetterISO == 'ZH' || twoLetterISO == 'KO') {
                    returnLang = twoLetterISO.toUpperCase();
                }
                PersonalData.GetUserSettings.preferredLanguage = returnLang;
                $translate.use(returnLang);
                localforage.setItem('userSettings', PersonalData.GetUserSettings);
                if (returnLang !== 'EN') {
                    downloadAllExerciseAudio(returnLang);
                }
            },
            function (error) {
                $log.warn("navigator.globalization.getPreferredLanguage() error", error);
                PersonalData.GetUserSettings.preferredLanguage = 'EN';
                $translate.use('EN');
                localforage.setItem('userSettings', PersonalData.GetUserSettings);
            }
        );
    } else {
        $translate.use('EN');
        PersonalData.GetUserSettings.preferredLanguage = 'EN';
        localforage.setItem('userSettings', PersonalData.GetUserSettings);
    }
    localforage.setItem('userSettings', PersonalData.GetUserSettings);
    localforage.setItem('userGoals', PersonalData.GetUserGoals);
    localforage.setItem('userProfile', PersonalData.GetUserProfile);
    localforage.setItem('userProgress', PersonalData.GetUserProgress);
    // Removing the default custom workout now that we only allow 1 for new users
    // var defaultCustom = [{
    //     "name": $translate.instant('BEGINNER_FULL'),
    //     "workout": ["Running in Place", "Jumping Jacks", "Windmill", "Steam Engine", "Bent Leg Twist", "Forward Lunges", "Wall Push-ups", "Step Touch", "Squats", "Overhead Arm Clap", "Elevated Crunches", "Push-ups", "Plank", "Rear Lunges", "Chest Expander", "Jump Rope Hops", "One Arm Side Push-up"]
    // }];
    var defaultCustom = [];
    localforage.setItem('customWorkouts', {
        savedWorkouts: defaultCustom
    });
    PersonalData.GetCustomWorkouts.savedWorkouts = defaultCustom;
    localforage.setItem('currentCustomArray', PersonalData.GetWorkoutArray);
    localforage.setItem('ratingStatus', false);
    localforage.setItem('ratingCategory', {show: false, past: false, shareCount: 0, sharePast: false});
    localforage.setItem('remindHome', {show: false, past: false});
    localforage.setItem('new310Home', false);
    localforage.setItem('externalStorage', false);
    localforage.setItem('userLanguages', PersonalData.GetLanguageSettings);
}

function convertUser($window, $log) {
    $log.info('Data Test: Converting User');
    $window.localStorage.setItem('firstUse', 29);
    $window.localStorage.setItem('timesUsed', 1);
    if (parseInt($window.localStorage.getItem('breakSetting')) == 1) {
        $window.localStorage.setItem('breakFreq', 0);
        $log.debug('Data Test: breakFreqWasSet: true');
    }
    if (parseInt($window.localStorage.getItem('randomizationOption')) == 1) {
        $window.localStorage.setItem('randomizationOption', true);
        $log.debug('Data Test: randomizationOption was: 1');
    } else if (parseInt($window.localStorage.getItem('randomizationOption')) == 0) {
        $window.localStorage.setItem('randomizationOption', false);
        $log.debug('Data Test: randomizationOption was: 0');
    }
    if (parseInt($window.localStorage.getItem('audioOption')) == 0) {
        $window.localStorage.setItem('audioOption', true);
        $log.debug('Data Test: audioOption was: 0');
    } else if (parseInt($window.localStorage.getItem('audioOption')) == 1) {
        $window.localStorage.setItem('audioOption', false);
        $log.debug('Data Test: audioOption was: 1');
    }

    //Sworkit Free Special Change ('Special Change' means it is worth noting in case of big changes)
    if (parseInt($window.localStorage.getItem('transition')) == 0) {
        $window.localStorage.setItem('transitionTime', 0);
        $window.localStorage.setItem('transition', false);
        $log.debug('Data Test: transition was: 0');
    } else if (parseInt($window.localStorage.getItem('transition')) == 5) {
        $window.localStorage.setItem('transitionTime', 5);
        $window.localStorage.setItem('transition', true);
        $log.debug('Data Test: transition was: 5 (on)');
    } else {
        $window.localStorage.setItem('transition', true);
    }
    $window.localStorage.setItem('kiipRewards', true);
    if ($window.localStorage.getItem("workoutArray") !== null) {
        var currentCustomWorkout = JSON.parse($window.localStorage.getItem("workoutArray"));
        var savedWorkoutsUnstring = [];
        savedWorkoutsUnstring[0] = {"name": 'My Awesome Workout', "workout": currentCustomWorkout};
        $log.debug('Data Test: currentCustomWorkout was: ' + JSON.stringify($window.localStorage.getItem("workoutArray")));
    } else {
        var savedWorkoutsUnstring = [];
        var currentCustomWorkout = [];
    }
    //End Special Changes

    if (parseInt($window.localStorage.getItem('customSet')) == 1) {
        $window.localStorage.setItem('customSet', true);
        $log.debug('Data Test: customSet was: 1');
    } else if (parseInt($window.localStorage.getItem('audioOption')) == 0) {
        $window.localStorage.setItem('customSet', false);
        $log.debug('Data Test: customSet was: 0');
    }
    if (parseInt($window.localStorage.getItem('mfpStatus')) == 1) {
        $window.localStorage.setItem('mfpStatus', true);
        $log.debug('Data Test: mfpStatus was: 1');
    } else if (parseInt($window.localStorage.getItem('mfpStatus')) == 0) {
        $window.localStorage.setItem('mfpStatus', false);
        $log.debug('Data Test: mfpStatus was: 1');
    } else {
        $window.localStorage.setItem('mfpStatus', false);
    }
    if (parseInt($window.localStorage.getItem('myFitnessReady')) == 1) {
        $window.localStorage.setItem('myFitnessReady', true);
        $log.debug('Data Test: myFitnessReady was: 1');
    } else if (parseInt($window.localStorage.getItem('myFitnessReady')) == 0) {
        $window.localStorage.setItem('myFitnessReady', false);
        $log.debug('Data Test: myFitnessReady was: 0');
    } else {
        $window.localStorage.setItem('myFitnessReady', false);
    }
    if (parseInt($window.localStorage.getItem('mfpWeight')) == 0) {
        $window.localStorage.setItem('mfpWeight', false);
    } else if ($window.localStorage.getItem('mfpWeight')) {
        $window.localStorage.setItem('mfpWeight', true);
    }
    $log.debug("Data Test: breakFreq was: " + $window.localStorage.getItem('breakFreq'));
    $log.debug("Data Test: exerciseTime was: " + $window.localStorage.getItem('exerciseTime'));
    $log.debug("Data Test: breakTime was: " + $window.localStorage.getItem('breakTime'));
    $log.debug("Data Test: transitionTime was: " + $window.localStorage.getItem('transitionTime'));
    $log.debug("Data Test: randomizationOption was: " + $window.localStorage.getItem('randomizationOption'));
    $log.debug("Data Test: workoutLength was: " + $window.localStorage.getItem('workoutLength'));
    $log.debug("Data Test: audioOption was: " + $window.localStorage.getItem('audioOption'));
    localforage.setItem('timingSettings', {
        customSet: ($window.localStorage.getItem('customSet') === "true") || false,
        breakFreq: parseInt($window.localStorage.getItem('breakFreq')) || 5,
        exerciseTime: parseInt($window.localStorage.getItem('exerciseTime')) || 30,
        breakTime: parseInt($window.localStorage.getItem('breakTime')) || 30,
        transitionTime: parseInt($window.localStorage.getItem('transitionTime')) || 5,
        transition: ($window.localStorage.getItem('transition') === "true") || true,
        randomizationOption: ($window.localStorage.getItem('randomizationOption') === "true") || true,
        workoutLength: parseInt($window.localStorage.getItem('workoutLength')) || 15,
        audioOption: ($window.localStorage.getItem('audioOption') === "true") || true,
        warningAudio: true,
        countdownBeep: true,
        autoPlay: true,
        countdownStyle: true,
        welcomeAudio: true,
        autoStart: true
    });
    localforage.setItem('timingSevenSettings', {
        customSetSeven: true,
        breakFreqSeven: 0,
        exerciseTimeSeven: 30,
        breakTimeSeven: 0,
        transitionTimeSeven: 10,
        randomizationOptionSeven: false,
        workoutLengthSeven: 7
    });
    $log.debug("Data Test: weight was: " + $window.localStorage.getItem('weight'));
    $log.debug("Data Test: weightType was: " + $window.localStorage.getItem('weightType'));
    $log.debug("Data Test: kiipRewards was: " + $window.localStorage.getItem('kiipRewards'));
    $log.debug("Data Test: mfpStatus was: " + $window.localStorage.getItem('mfpStatus'));
    $log.debug("Data Test: myFitnessReady was: " + $window.localStorage.getItem('myFitnessReady'));
    $log.debug("Data Test: mfpWeight was: " + $window.localStorage.getItem('mfpWeight'));
    $log.debug("Data Test: mfpAccessToken was: " + $window.localStorage.getItem('mfpAccessToken'));
    $log.debug("Data Test: mfpRefreshToken was: " + $window.localStorage.getItem('mfpRefreshToken'));

    localforage.setItem('userSettings', {
        weight: parseInt($window.localStorage.getItem('weight')) || 150,
        weightType: parseInt($window.localStorage.getItem('weightType')) || 0,
        kiipRewards: true,
        mPoints: true,
        mfpStatus: ($window.localStorage.getItem('mfpStatus') === "true"),
        myFitnessReady: ($window.localStorage.getItem('myFitnessReady') === "true"),
        mfpWeight: ($window.localStorage.getItem('mfpWeight') === "true"),
        mfpAccessToken: $window.localStorage.getItem('mfpAccessToken') || false,
        mfpRefreshToken: $window.localStorage.getItem('mfpRefreshToken') || false,
        videosDownloaded: false,
        downloadDecision: true,
        healthKit: false,
        lastlength: 5,
        timerTaps: 0,
        showAudioTip: true
    });
    $log.debug("Data Test: dailyGoal was: " + $window.localStorage.getItem('dailyGoal'));
    $log.debug("Data Test: weeklyGoal was: " + $window.localStorage.getItem('weeklyGoal'));
    localforage.setItem('userGoals', {
        dailyGoal: parseInt($window.localStorage.getItem('dailyGoal')) || 15,
        weeklyGoal: parseInt($window.localStorage.getItem('weeklyGoal')) || 75
    });
    $log.debug("Data Test: weeklyTotal was: " + $window.localStorage.getItem('weeklyTotal'));
    $log.debug("Data Test: week was: " + $window.localStorage.getItem('week'));
    localforage.setItem('userProgress', {
        monthlyTotal: 0,
        weeklyTotal: parseInt($window.localStorage.getItem('weeklyTotal')) || 0,
        dailyTotal: 0,
        totalCalories: 0,
        totalProgress: 0,
        day: 0,
        week: parseInt($window.localStorage.getItem('week')) || 0
    });
    localforage.setItem('customWorkouts', {
        savedWorkouts: savedWorkoutsUnstring
    });
    localforage.setItem('reminder', {
        daily: {status: false, time: 7, minutes: 0},
        inactivity: {frequency: 2, status: false, time: 7, minutes: 0}
    });
    LocalData.SetReminder = {
        daily: {status: false, time: 7, minutes: 0},
        inactivity: {frequency: 2, status: false, time: 7, minutes: 0}
    };
    localforage.setItem('ratingStatus', false);
    localforage.setItem('ratingCategory', {show: false, past: false, shareCount: 0, sharePast: false});
    localforage.setItem('remindHome', {show: false, past: false});
    localforage.setItem('new310Home', true);
    localforage.setItem('userLanguages', PersonalData.GetLanguageSettings);
    //Callback for last item includes loadStoredData()
    localforage.setItem('currentCustomArray', {
        workoutArray: currentCustomWorkout
    });
    $window.localStorage.setItem('refreshUpdated', true);
    $log.debug('Data Test: refreshUpdate: ' + $window.localStorage.getItem("refreshUpdated"));
}

function migrateData($rootScope, $translate, $timeout, AppSyncService, AccessService, FirebaseService, $window, $log) {
    if ($window.localStorage.getItem('dataMigrated') === null && $rootScope.authData && true) {
        $timeout(function () {
            $window.localStorage.setItem('dataMigrated', true);
        }, 2500)
    }
    if ($window.localStorage.getItem('dataMigrated') === null && localforage.driver() == localforage.LOCALSTORAGE && true) {
        $log.info("Migrating data");
        $window.migrationData = openDatabase('localforage', '1', 'localforage', 4980736);
        $window.migrationData.transaction(
            function (tx) {
                tx.executeSql("SELECT * FROM keyvaluepairs WHERE key = ?", ['customWorkouts'],
                    function (txs, result) {
                        localforage.getItem('customWorkouts', function (resultWorkouts) {
                            resultWorkouts.savedWorkouts = resultWorkouts.savedWorkouts.concat(JSON.parse(result.rows.item(0).value).savedWorkouts);
                            localforage.setItem('customWorkouts', resultWorkouts)
                                .then(function () {
                                    loadStoredData($translate, AppSyncService, FirebaseService, AccessService, $window);
                                });
                        })
                    },
                    function (txs, err) {
                        $log.error("customWorkout error", err)
                    });
                loadStoredData($translate, AppSyncService, FirebaseService, AccessService, $window);
            }
        );
        $window.localStorage.setItem('dataMigrated', true);
    } else {
        $log.info("Data migration not needed");
        loadStoredData($translate, AppSyncService, FirebaseService, AccessService, $window);
        $window.localStorage.setItem('dataMigrated', true);
    }
}

function loadStoredData($translate, AppSyncService, FirebaseService, AccessService, $window) {
    localforage.getItem('new310Home', function (result) {
        if (result == null) {
            localforage.setItem('new310Home', false);
            globalNew310Option = true;
        } else {
            globalNew310Option = result;
        }
    });
    localforage.getItem('ratingCategory', function (result) {
        if (result == null) {
            localforage.setItem('ratingCategory', {show: false, past: false, shareCount: 0, sharePast: false});
            $window.localStorage.setItem('timesUsed', 1);
        } else {
            globalRateOption = result.show;
            if (result.shareCount) {
                globalShareOption = result.shareCount;
            } else {
                globalShareOption = 0;
            }
        }
    });
    localforage.getItem('remindHome', function (result) {
        if (result == null) {
            localforage.setItem('remindHome', {show: false, past: false});
        } else {
            globalRemindOption = result.show;
        }
    });
    localforage.getItem('timingSettings', function (result) {
        if (result == null) {
            localforage.setItem('timingSettings', TimingData.GetTimingSettings);
        } else {
            if (result.welcomeAudio == null) {
                result.welcomeAudio = true;
            }
            if (result.autoStart == null) {
                result.autoStart = true;
                localforage.setItem('timingSettings', result);
            }
            if (result.sunSalutation == null) {
                result.sunSalutation = 8;
                result.fullSequence = 21;
                result.runnerYoga = 15;
                result.restStatus = true;
            }
            if (result.feelGoodYoga == null) {
                result.feelGoodYoga = 15;
                result.beginnerYoga = 15;
                result.coreYoga = 15;
                result.toneYoga = 15;
                localforage.setItem('timingSettings', result);
            }
            TimingData.GetTimingSettings = result;
        }
    });
    localforage.getItem('timingSevenSettings', function (result) {
        if (result == null) {
            localforage.setItem('timingSevenSettings', TimingData.GetSevenMinuteSettings);
        } else {
            TimingData.GetSevenMinuteSettings = result
        }
    });
    localforage.getItem('reminder', function (result) {
        if (result == null) {
            localforage.setItem('reminder', {
                daily: {status: false, time: 7, minutes: 0},
                inactivity: {frequency: 2, status: false, time: 7, minutes: 0}
            });
        } else {
            LocalData.SetReminder = result;
            checkForNotification($window, $translate);
            if (LocalData.SetReminder.inactivity.status) {
                cordova.plugins.notification.local.cancel(2);
                var nDate = new Date();
                nDate.setHours(LocalData.SetReminder.inactivity.time);
                nDate.setMinutes(LocalData.SetReminder.inactivity.minutes);
                nDate.setSeconds(0);
                nDate.setDate(nDate.getDate() + LocalData.SetReminder.inactivity.frequency);
                setTimeout(function () {
                    cordova.plugins.notification.local.schedule({
                        id: 2,
                        text: $translate.instant('TOO_LONG'),  // The message that is displayed
                        title: $translate.instant('WORKOUT_REM'),  // The title of the message
                        at: nDate,
                        autoClear: true,
                        smallIcon: 'ic_launcher_small',
                        icon: 'ic_launcher'
                    });
                    console.log('inactivity notification set for: ' + JSON.stringify(nDate))
                }, 4000);
            }
            if (LocalData.SetReminder.daily.status) {
                setupNotificationDaily($translate);
            }
        }
    });
    localforage.getItem('userLanguages', function (result) {
        if (result == null) {
            localforage.setItem('userLanguages', PersonalData.GetLanguageSettings);
        } else if (result.HI == null) {
            PersonalData.GetLanguageSettings = result;
            PersonalData.GetLanguageSettings.HI = false;
            PersonalData.GetLanguageSettings.JA = false;
            PersonalData.GetLanguageSettings.ZH = false;
            PersonalData.GetLanguageSettings.KO = false;
            if (result.TR == null) {
                PersonalData.GetLanguageSettings.TR = false;
            }
        } else {
            PersonalData.GetLanguageSettings = result;
        }
    });
    localforage.getItem('userSettings', function (result) {
        if (result == null) {
            PersonalData.GetUserSettings.preferredLanguage = "EN";
            localforage.setItem('userSettings', PersonalData.GetUserSettings);
        } else {
            if (result.healthKit == null) {
                result.healthKit = false;
            }
            if (result.lastLength == null) {
                result.lastLength = 5;
            }
            if (result.timerTaps == null) {
                result.timerTaps = 0;
            }
            if (result.showNext == null) {
                result.showNext = true;
            }
            if (result.showAudioTip == null) {
                result.showAudioTip = true;
            }
            if (result.preferredLanguage == null) {
                result.preferredLanguage = 'EN';
                if (result.humanapiHumanId == null) {
                    result.humanapiClientUserId = null;
                    result.humanapiHumanId = '';
                    result.humanapiAccessToken = null;
                    result.humanapiPublicToken = null;
                }
                if (navigator.globalization) {
                    navigator.globalization.getPreferredLanguage(
                        function (resultLang) {
                            var returnLang = 'EN';
                            var twoLetterISO = resultLang.value.substring(0, 2).toUpperCase();
                            if (twoLetterISO == 'ES' && resultLang.value.length > 2) {
                                returnLang = 'ESLA';
                            } else if (twoLetterISO == 'DE' || twoLetterISO == 'RU' || twoLetterISO == 'TR' || twoLetterISO == 'FR' || twoLetterISO == 'PT' || twoLetterISO == 'IT' || twoLetterISO == 'ES' || twoLetterISO == 'HI' || twoLetterISO == 'JA' || twoLetterISO == 'ZH' || twoLetterISO == 'KO') {
                                returnLang = twoLetterISO.toUpperCase();
                            }
                            result.preferredLanguage = returnLang;
                            $translate.use(returnLang);
                            PersonalData.GetUserSettings = result;
                            localforage.setItem('userSettings', PersonalData.GetUserSettings);
                            if (returnLang !== 'EN') {
                                downloadAllExerciseAudio(returnLang);
                            }
                        },
                        function (error) {
                            $translate.use('EN');
                            PersonalData.GetUserSettings = result;
                            localforage.setItem('userSettings', PersonalData.GetUserSettings);
                        }
                    );
                } else {
                    $translate.use('EN');
                    PersonalData.GetUserSettings = result;
                    localforage.setItem('userSettings', PersonalData.GetUserSettings);
                }
            } else {
                if (result.mfpAccessToken == null) {
                    result.mfpStatus = false;
                    result.myFitnessReady = false;
                    result.mfpWeight = false;
                    result.mfpAccessToken = false;
                    result.mfpRefreshToken = false;
                }
                if (result.humanapiHumanId == null) {
                    result.humanapiClientUserId = null;
                    result.humanapiHumanId = '';
                    result.humanapiAccessToken = null;
                    result.humanapiPublicToken = null;
                }
                PersonalData.GetUserSettings = result;
                $translate.use(result.preferredLanguage);
                if (!PersonalData.GetLanguageSettings[PersonalData.GetUserSettings.preferredLanguage]) {
                    downloadAllExerciseAudio(PersonalData.GetUserSettings.preferredLanguage);
                }
            }
        }
    });
    localforage.getItem('userGoals', function (result) {
        if (result == null) {
            localforage.setItem('userGoals', PersonalData.GetUserGoals);
        } else {
            PersonalData.GetUserGoals = result;
        }
    });
    localforage.getItem('userProgress', function (result) {
        if (result == null) {
            localforage.setItem('userProgress', PersonalData.GetUserProgress);
        } else {
            PersonalData.GetUserProgress = result;
        }
    });
    localforage.getItem('customWorkouts', function (result) {
        if (result == null) {
            localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
        } else {
            PersonalData.GetCustomWorkouts = result;
        }
        if (PersonalData.GetCustomWorkouts.savedWorkouts == undefined) {
            PersonalData.GetCustomWorkouts.savedWorkouts = PersonalData.GetCustomWorkouts;
        }
    });
    localforage.getItem('currentCustomArray', function (result) {
        if (result == null) {
            localforage.setItem('currentCustomArray', PersonalData.GetWorkoutArray);
        } else {
            PersonalData.GetWorkoutArray = result;
        }
    });
    localforage.getItem('ratingStatus', function (result) {
        if (result == null) {
            localforage.setItem('ratingStatus', false);
        }
    });
    localforage.getItem('externalStorage', function (result) {
        if (result == null) {
            localforage.setItem('externalStorage', false);
        } else {
            globalExternal = result;
        }
    });
    localforage.getItem('backgroundAudio', function (result) {
        if (result == null) {
            localforage.setItem('backgroundAudio', PersonalData.GetAudioSettings);
        } else {
            PersonalData.GetAudioSettings = result;
        }
        if ($window.device) {
            LowLatencyAudio.turnOffAudioDuck(PersonalData.GetAudioSettings.duckOnce.toString());
        }
    });
    localforage.getItem('googleFitStatus', function (result) {
        if (result == null) {
            localforage.setItem('googleFitStatus', PersonalData.GetGoogleFit);
        } else {
            PersonalData.GetGoogleFit = result;
        }
    });
    localforage.getItem('userProfile', function (result) {
        var dateNow = new Date();
        var timeNow = dateNow.getTime();
        if (result == null) {
            PersonalData.GetUserProfile.lastLogin = timeNow;
            localforage.setItem('userProfile', PersonalData.GetUserProfile);
        }
        else {
            result.lastLogin = timeNow;
            PersonalData.GetUserProfile = result;
        }
    });
    var timesUsedVar = parseInt($window.localStorage.getItem('timesUsed'));
    timesUsedVar++;
    $window.localStorage.setItem('timesUsed', (timesUsedVar));

    if ($window.localStorage.getItem('firstUse') && parseInt($window.localStorage.getItem('firstUse')) < 30 ) {
        $window.localStorage.setItem('firstUse', 30);
        $window.localforage.setItem('legacyBasicAccess', 0).then(function() {
            AccessService.getBasicAccess();
        })
    }

    // Timeout helps ensure normal loadStoredData has completed
    setTimeout(function () {
        if (FirebaseService.authData) {
            AppSyncService.syncStoredData();
            AppSyncService.syncLocalForageCustomWorkouts();
            AppSyncService.syncWebSqlWorkoutLog();
        }
    }, 1500)

}