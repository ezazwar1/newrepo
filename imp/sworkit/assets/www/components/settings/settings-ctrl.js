angular.module('swMobileApp').controller('SettingsCtrl', function ($rootScope, $scope, $http, $ionicModal, $translate, $timeout, $ionicPopup, $q, $window, UserService, AppSyncService, WorkoutService, FirebaseService, $log) {
    $scope.userSettings = UserService.getUserSettings();
    $scope.googleFitSettings = UserService.getFitSettings();
    $scope.goalSettings = UserService.getGoalSettings();
    $scope.timeSettings = UserService.getTimingIntervals();
    $scope.originalLanguage = $scope.userSettings.preferredLanguage;
    $scope.healthKitAvailable = false;
    $scope.data = {showInfo: false};
    $scope.kindleDevice = false;
    if (ionic.Platform.isAndroid()) {
        $scope.androidPlatform = true;
        if (isKindle()) {
            $scope.kindleDevice = true;
        }
    } else {
        $scope.androidPlatform = false;
        if (device) {
            window.plugins.healthkit.available(
                function (result) {
                    if (result == true) {
                        $scope.healthKitAvailable = true;
                    }
                },
                function () {
                    $scope.healthKitAvailable = false;
                }
            );
            window.plugins.healthkit.available(
                function (result) {
                    if (result == true) {
                        $scope.healthKitAvailable = true;
                    }
                },
                function () {
                    $scope.healthKitAvailable = false;
                }
            );
        } else {
            //Available in browser for testing purposes
            $scope.healthKitAvailable = true;
        }
    }
    $scope.lowerAndroid = lowerAndroidGlobal;
    $scope.mfpWeightStatus = {data: $scope.userSettings.mfpWeight};
    $scope.displayWeight = {data: 0};
    $scope.weightTypes = [{id: 0, title: 'LBS'}, {id: 1, title: 'KGS'}];
    $scope.selectedType = {data: $scope.weightTypes[$scope.userSettings.weightType]};
    $scope.languages = [
        {id: 0, short: 'DE', title: 'Deutsch'},
        {id: 1, short: 'EN', title: 'English'},
        {id: 2, short: 'ES', title: 'Español (España)'},
        {id: 3, short: 'ESLA', title: 'Español (América Latina)'},
        {id: 4, short: 'FR', title: 'Français'},
        {id: 5, short: 'IT', title: 'Italiano'},
        {id: 6, short: 'PT', title: 'Português'},
        {id: 7, short: 'RU', title: 'Русский'},
        {id: 8, short: 'TR', title: 'Türkçe'},
        {id: 9, short: 'HI', title: 'हिंदी'},
        {id: 10, short: 'JA', title: '日本語'},
        {id: 11, short: 'ZH', title: '简体中文'},
        {id: 12, short: 'KO', title: '한국어 [韓國語]'}
    ];

    if (device) {
        LowLatencyAudio.unload('welcome');
    }

    $scope.getLanguage = function () {
        var matchLang = '';
        $scope.languages.forEach(function (element) {
            if (element.short == $scope.userSettings.preferredLanguage) {
                matchLang = element
            }
        });
        return matchLang;
    };
    $scope.selectedLanguage = {data: $scope.getLanguage()};
    $scope.changeLanguage = function (langKey) {
        $log.info("changeLanguage()");
        $translate.use(langKey.short);
        $scope.userSettings.preferredLanguage = $scope.selectedLanguage.data.short;
        if (device) {
            WorkoutService.downloadUnlockedExercises("newlocale");
            if (ionic.Platform.isIOS()) {
                window.plugins.sworkitapplewatch.initWatchTranslations(
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
            }
        }

    };
    $scope.convertWeight = function () {
        if ($scope.userSettings.weightType == 0) {
            $scope.displayWeight.data = $scope.userSettings.weight;
        } else {
            $scope.displayWeight.data = Math.round(($scope.userSettings.weight / 2.20462));
        }
    };
    $scope.convertWeight();
    $scope.$watch('selectedType.data', function (newValue) {
        if (!isNaN(newValue.id)) {
            $scope.userSettings.weightType = newValue.id;
        }
        $scope.convertWeight();
    });
    $scope.$watch('displayWeight.data', function () {
        if ($scope.userSettings.weightType == 0) {
            $scope.userSettings.weight = $scope.displayWeight.data;
        } else {
            $scope.userSettings.weight = Math.round(($scope.displayWeight.data * 2.20462));
        }
    });
    $scope.syncWeight = function () {
        if ($scope.mfpWeightStatus.data) {
            getMFPWeight($http, $scope);
        }
    };
    $scope.connectedGoogleFit = function () {
        $scope.googleFitSettings.attempted = true;
        if ($scope.googleFitSettings.enabled) {
            $scope.googleFitSettings.enabled = false;
        } else {
            $scope.enableGoogleFit()
        }
    };
    $scope.enableGoogleFit = function () {
        var infoTemplate = '<div class="end-workout-health" style="text-align: center;width:230px;margin:0 auto"><img src="img/googleFit.png" style="height:50px;display: block;margin: 10px auto;"/><div style="width:100%"><p>' + $translate.instant('GFIT_1') + '</p><p>' + $translate.instant('GFIT_2') + '</p><p style="color:#777;font-size:12px">' + $translate.instant('GFIT_3') + '</p><button class="button button-assertive" ng-click="confirmGoogleFit()" style="width:230px">{{"CONNECT_FIT" | translate}}</button></div></div>';
        $scope.googleFitPopup = $ionicPopup.show({
            title: '',
            subTitle: '',
            scope: $scope,
            template: infoTemplate,
            hardwareBackButtonClose: true,
            buttons: [
                {text: $translate.instant('CANCEL_SM')}
            ]
        });
    };
    $scope.hideGoogleFitPopup = function () {
        $scope.googleFitPopup.close();
    };
    $scope.confirmGoogleFit = function () {
        $scope.hideGoogleFitPopup();
        $scope.googleFitSettings.enabled = true;
        $scope.syncLastWorkoutFit();
    };
    $scope.syncLastWorkoutFit = function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM SworkitFree ORDER BY created_on', [], function (tx, results) {
                if (results.rows.length > 0) {
                    var lastWorkout = results.rows.item(0);
                    var fitnessActivity = LocalData.GetWorkoutTypes[lastWorkout.type] && LocalData.GetWorkoutTypes[lastWorkout.type].googleActivity ? LocalData.GetWorkoutTypes[lastWorkout.type].googleActivity : 'CIRCUIT_TRAINING';
                    var lastDate = new Date(lastWorkout.utc_created);
                    window.plugins.GoogleFit.insertSession(
                        [lastDate.getTime(), lastWorkout.minutes_completed * 60 * 60000, "Sworkit Workout", fitnessActivity, lastWorkout.calories],
                        function () {
                            console.log('Success Syncing Last Google Fit Workout')
                        },
                        function (result) {
                            console.log('Google Fit Fail ' + result)
                        }
                    )
                }
            }, null);
        });
    };
    $scope.connectHealthKit = function () {

        $timeout(function () {
            window.plugins.healthkit.requestAuthorization(
                {
                    'readTypes': ['HKQuantityTypeIdentifierBodyMass', 'HKQuantityTypeIdentifierHeartRate'],
                    'writeTypes': ['HKQuantityTypeIdentifierActiveEnergyBurned', 'workoutType']
                },
                function () {
                    PersonalData.GetUserSettings.healthKit = true;
                    $scope.userSettings.healthKit = true;
                    localforage.setItem('userSettings', PersonalData.GetUserSettings);
                    $scope.readWeight();
                },
                function () {
                }
            );
        }, 1000);
    };
    $scope.reconnectHealthKit = function () {
        $scope.healthPopup = $ionicPopup.show({
            title: $translate.instant('HEALTH_SET'),
            subTitle: '',
            scope: $scope,
            template: '<button class="button button-full button-calm" ng-click="hideHealthPopup();healthKitHelp()">' + $translate.instant('UPDATE_SET') + '</button><button class="button button-full button-assertive" ng-click="hideHealthPopup();disableHealthKit();">' + $translate.instant('DISABLE_SM') + '</button>',
            buttons: [
                {text: 'Cancel'}
            ]
        });
    };
    $scope.readWeight = function () {
        window.plugins.healthkit.readWeight({
                'requestWritePermission': false,
                'unit': 'lb'
            },
            function (msg) {
                if (!isNaN(msg)) {
                    PersonalData.GetUserSettings.weight = msg;
                    $scope.convertWeight();
                }
            },
            function () {
            }
        );
    };
    $scope.hideHealthPopup = function () {
        $scope.healthPopup.close();
    };
    $scope.healthKitHelp = function () {
        $scope.healthModal.show();
    };
    $ionicModal.fromTemplateUrl('components/settings/healthkit-help-modal.html', function (modal) {
        $scope.healthModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: false,
        backdropClickToClose: true,
        hardwareBackButtonClose: false
    });
    $scope.closeHealthModal = function () {
        $scope.healthModal.hide();
    };
    $scope.disableHealthKit = function () {
        PersonalData.GetUserSettings.healthKit = false;
        localforage.setItem('userSettings', PersonalData.GetUserSettings);
    };

    $scope.reconnectMFP = function () {
        $scope.mfpPopup = $ionicPopup.show({
            title: 'MyFitnessPal',
            subTitle: '',
            scope: $scope,
            template: '<button class="button button-full button-calm" ng-click="hidePopup();connectMFP();">' + $translate.instant('RECONNECT') + '</button><button class="button button-full button-assertive" ng-click="hidePopup();disconnectMFP();">' + $translate.instant('DISCONNECT') + '</button>',
            buttons: [
                {text: $translate.instant('CANCEL_SM')}
            ]
        });
    };
    $scope.hidePopup = function () {
        $scope.mfpPopup.close();
    };
    $scope.disconnectMFP = function () {
        var refresher = PersonalData.GetUserSettings.mfpRefreshToken;
        var newURL = "https://www.myfitnesspal.com/oauth2/revoke?client_id=sworkit&refresh_token=" + refresher;
        $http({
            method: 'POST',
            url: newURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .then(function () {
                PersonalData.GetUserSettings.mfpAccessToken = false;
                PersonalData.GetUserSettings.mfpRefreshToken = false;
                PersonalData.GetUserSettings.mfpStatus = false;
                PersonalData.GetUserSettings.mfpWeight = false;
                persistMultipleObjects($q, {
                    'userSettings': PersonalData.GetUserSettings
                }, function () {
                    // When all promises are resolved
                    AppSyncService.syncLocalForageObject('userSettings', [
                        'lastLength',
                        'mfpAccessToken',
                        'mfpRefreshToken',
                        'mfpStatus',
                        'mfpWeight',
                        'weight',
                        'weightType'
                    ], PersonalData.GetUserSettings);
                });
                showNotification($translate.instant('DISCONNECT_COMP'), 'button-balanced', 2000);
            }, function () {
                showNotification($translate.instant('CONN_ERROR'), 'button-assertive', 2000);
            })
    };
    $scope.connectMFP = function () {
        var authUrl = 'https://www.myfitnesspal.com/oauth2/authorize?client_id=sworkit&scope=diary&redirect_uri=http://m.sworkit.com/mfp-auth.html&access_type=offline&response_type=code';

        $window.childBrowserInstance = $window.open(authUrl, '_blank', 'location=no,clearcache=yes,clearsessioncache=yes,AllowInlineMediaPlayback=yes');

        $window.childBrowserInstance.addEventListener('loadstart', function (event) {
            $rootScope.interceptFacebook(event.url)
        });

        $window.childBrowserInstance.addEventListener('loadstop', function (event) {
            $rootScope.locationChanged(event.url)
        });

        $window.childBrowserInstance.addEventListener('exit', function () {
            $rootScope.childBrowserClosed()
        });

    };

    // Human API connection
    $scope.connectHuman = function () {
        console.log('Connect to Human API');
        var baseUrl = "https://connect.humanapi.co/embed?";
        var clientID = "116d7f1a9e686a3532ed247fe2eed31043e1449f";
        var clientSecret = "d7e2d545f5d81a1343f1aeb3a7044cc7f6735092"; // TODO: Does this need to be generated?
        if (PersonalData.GetUserSettings.humanapiClientUserId == null) {
            PersonalData.GetUserSettings.humanapiClientUserId = FirebaseService.getUserUID() ? FirebaseService.getUserUID() + '-sworkit-' + Math.random().toString(36).substring(14) : 'sworkit-' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        }

        console.log('Connect to Human API, clientUserID:', PersonalData.GetUserSettings.humanapiClientUserId);
        var clientUserId = PersonalData.GetUserSettings.humanapiClientUserId;
        var publicToken = PersonalData.GetUserSettings.humanapiPublicToken || null;

        var finishURL = "https://connect.humanapi.co/blank/hc-finish";
        var closeURL = "https://connect.humanapi.co/blank/hc-close";

        var url = baseUrl + 'client_id=' + clientID + '&client_user_id=' + clientUserId + '&finish_url=' + finishURL +
            '&close_url=' + closeURL + '&mode=sworkit' + (publicToken != null ? "&public_token=" + publicToken : '');
        console.log('connectHuman url', url);
        var ref;
        if ($scope.androidPlatform) {
            ref = window.open(url, '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbar=no');
        } else {
            ref = window.open(url, '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbar=yes,toolbarposition=top,closebuttoncaption= ');
        }

        ref.addEventListener('loadstart', function (event) {
            console.log('loadStartEvent', event);
            if (event.url.indexOf('https://connect.humanapi.co/blank/') === 0) {
                if (event.url.indexOf('hc-finish') !== -1) {
                    var paramString = event.url.replace(finishURL + "?", "");

                    //Create sessionTokenObject with query parameters
                    var params = {};
                    var regex = /([^&=]+)=?([^&]*)/g;

                    while (match = regex.exec(paramString))
                        params[match[1]] = match[2];

                    var sessionTokenObject = {
                        "humanId": params["human_id"],
                        "clientId": params["client_id"],
                        "clientSecret": clientSecret,
                        "sessionToken": params["session_token"]
                    };

                    //Human API Token Exchange. Usually this is performed on the server.
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://user.humanapi.co/v1/connect/tokens");
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            if (xhr.status == 200) {

                                //Authentication complete! Save the values xhr.responseText for future use.
                                var res = JSON.parse(xhr.responseText);
                                PersonalData.GetUserSettings.humanapiHumanId = res.humanId;
                                PersonalData.GetUserSettings.humanapiAccessToken = res.accessToken;
                                PersonalData.GetUserSettings.humanapiPublicToken = res.publicToken;
                                console.log("humanId:" + res.humanId);
                                console.log("accessToken:" + res.accessToken);
                                console.log("publicToken:" + res.publicToken);
                                console.log("clientUserId:" + res.clientUserId);
                                persistMultipleObjects($q, {
                                    'userSettings': PersonalData.GetUserSettings
                                }, function () {
                                    // When all promises are resolved
                                    AppSyncService.syncLocalForageObject('userSettings', [
                                        'humanapiClientUserId',
                                        'humanapiHumanId',
                                        'humanapiAccessToken',
                                        'humanapiPublicToken'
                                    ], PersonalData.GetUserSettings);
                                });
                                if (!publicToken) {
                                    showNotification($translate.instant('AUTH_SUCC'), 'button-balanced', 2000);
                                }
                            } else {
                                console.log("STATUS: " + xhr.statusText);
                                console.log("An error occurred during HumanAPI token exchange.");
                            }
                        }
                    };
                    xhr.send(JSON.stringify(sessionTokenObject));
                    ref.close();

                } else if (event.url.indexOf('hc-close') !== -1) {
                    console.log('Close callback called');
                    //Do something on close (optional)
                    ref.close();
                }
            }
        });

    };

    $rootScope.interceptFacebook = function (url) {
        console.log("starting to load: " + url);
        var urlParams = deparam(url);
        if (url == "http://m.sworkit.com/intercept.html") {
            window.open("https://www.myfitnesspal.com/oauth2/authorize?client_id=sworkit&scope=diary&redirect_uri=http://m.sworkit.com/mfp-auth.html&state=freeapp&access_type=offline&response_type=code", "_system", "location=no,AllowInlineMediaPlayback=yes");
        } else if (urlParams.code && urlParams.user && url.indexOf("http://m.sworkit.com/mfp-auth.html") !== -1) {
            $window.childBrowserInstance.close();
            myObj = urlParams;
        }
    };

    $rootScope.locationChanged = function (url) {
        $window.childBrowserInstance.executeScript({
            code: '$("#facebook-login-css").click(function() {window.location = "http://m.sworkit.com/intercept.html"})'
        }, function () {
        });
        myObj = deparam(url);
    };

    $rootScope.childBrowserClosed = function () {
        if (myObj.code) {
            console.log('myObj.code is: ' + myObj.code);
            var newURL = "https://www.myfitnesspal.com/oauth2/token?client_id=sworkit&client_secret=192867e0c606f7a7b953&grant_type=authorization_code&code=" + myObj.code;
            $http({
                method: 'POST',
                url: newURL,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (resp) {
                    PersonalData.GetUserSettings.mfpAccessToken = resp.data.access_token;
                    PersonalData.GetUserSettings.mfpRefreshToken = resp.data.refresh_token;
                    PersonalData.GetUserSettings.mfpStatus = true;
                    persistMultipleObjects($q, {
                        'userSettings': PersonalData.GetUserSettings
                    }, function () {
                        // When all promises are resolved
                        AppSyncService.syncLocalForageObject('userSettings', [
                            'lastLength',
                            'mfpAccessToken',
                            'mfpRefreshToken',
                            'mfpStatus',
                            'mfpWeight',
                            'weight',
                            'weightType'
                        ], PersonalData.GetUserSettings);
                    });
                    showNotification($translate.instant('AUTH_SUCC'), 'button-balanced', 2000);
                    trackEvent('More Action', 'MyFitnessPal Connection', 0);
                    logActionSessionM('MyFitnessPal');
                }, function () {
                    $rootScope.childBrowserRetry();
                })
        }
        else {
            var helpMessage = $translate.instant('TAP_HELP') + ' contact@sworkit.com.';
            navigator.notification.confirm(
                helpMessage,
                $scope.getHelp,
                $translate.instant('CONNECT_ERROR'),
                [$translate.instant('CANCEL_SM'), $translate.instant('HELP')]
            );
        }

    };
    $rootScope.childBrowserRetry = function () {
        if (myObj.code) {
            myObj.code = myObj.code + '%3d%3d';
            var newURL = "https://www.myfitnesspal.com/oauth2/token?client_id=sworkit&client_secret=192867e0c606f7a7b953&grant_type=authorization_code&code=" + myObj.code;
            $http({
                method: 'POST',
                url: newURL,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (resp) {
                    PersonalData.GetUserSettings.mfpAccessToken = resp.data.access_token;
                    PersonalData.GetUserSettings.mfpRefreshToken = resp.data.refresh_token;
                    PersonalData.GetUserSettings.mfpStatus = true;
                    persistMultipleObjects($q, {
                        'userSettings': PersonalData.GetUserSettings
                    }, function () {
                        // When all promises are resolved
                        AppSyncService.syncLocalForageObject('userSettings', [
                            'lastLength',
                            'mfpAccessToken',
                            'mfpRefreshToken',
                            'mfpStatus',
                            'mfpWeight',
                            'weight',
                            'weightType'
                        ], PersonalData.GetUserSettings);
                    });
                    showNotification($translate.instant('AUTH_SUCC'), 'button-balanced', 2000);
                    trackEvent('More Action', 'MyFitnessPal Connection', 0);
                    logActionSessionM('MyFitnessPal');
                }, function () {
                    showNotification($translate.instant('CON_ERROR'), 'button-assertive', 2000);
                })
        }
        else {
            var helpMessage = $translate.instant('TAP_HELP') + ' contact@sworkit.com.';
            navigator.notification.confirm(
                helpMessage,
                $scope.getHelp,
                $translate.instant('CONNECT_ERROR'),
                [$translate.instant('CANCEL_SM'), $translate.instant('HELP')]
            );
        }

    };
    $scope.getHelp = function (buttonIndex) {
        if (buttonIndex == 2) {
            window.open('http://sworkit.com/mfp', 'blank', 'location=no,AllowInlineMediaPlayback=yes');
        }
    };
    $scope.rateSworkit = function () {
        $timeout(function () {
            launchAppStore(2);
        }, 500);
    };

    $scope.$on('$ionicView.leave', function () {
        if ($scope.mfpWeightStatus.data) {
            PersonalData.GetUserSettings.mfpWeight = true;
        }

        persistMultipleObjects($q, {
            'userSettings': PersonalData.GetUserSettings,
            'userGoals': PersonalData.GetUserGoals,
            'timingSettings': TimingData.GetTimingSettings
        }, function () {
            // When all promises are resolved
            AppSyncService.syncStoredData();
        });

        $log.debug("$ionicView.leave check for audio locale change...");
        if (PersonalData.GetUserSettings.preferredLanguage !== $scope.originalLanguage && device) {
            $log.debug("New audio locale");
            downloadAllExerciseAudio(PersonalData.GetUserSettings.preferredLanguage);
        }
        if (device && ionic.Platform.isAndroid()) {
            localforage.setItem('googleFitStatus', PersonalData.GetGoogleFit);
        }
        $scope.healthModal.remove();
    });
});
