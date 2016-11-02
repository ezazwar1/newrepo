angular.module('swMobileApp').factory('AccountsService', function ($rootScope, $state, $translate, $ionicPopup, AppSyncService, FirebaseService, WorkoutService, AccessService, $window, $log) {

        var _syncDataPostAuth = function () {
            AppSyncService.syncStoredData();
            AppSyncService.syncWebSqlWorkoutLog();
            AppSyncService.checkLocalForageCustomWorkouts();
            AccessService.refreshCache();
        };

        var _facebookPostAuthProcess = function (authData, emailAddress, isSignup) {
            PersonalData.GetUserProfile.uid = authData.uid;
            PersonalData.GetUserProfile.email = emailAddress;
            PersonalData.GetUserProfile.firstName = authData.facebook.cachedUserProfile.first_name || '';
            PersonalData.GetUserProfile.lastName = authData.facebook.cachedUserProfile.last_name || '';
            PersonalData.GetUserProfile.locale = authData.facebook.cachedUserProfile.locale || '';
            PersonalData.GetUserProfile.authType = 'facebook';
            PersonalData.GetUserProfile.groupCode = authData.groupCode || null;
            var gender = '';
            if (authData.facebook.cachedUserProfile.gender) {
                switch (authData.facebook.cachedUserProfile.gender.toLowerCase()) {
                    case 'male':
                        gender = "MALE";
                        break;
                    case 'female':
                        gender = "FEMALE";
                        break;
                    case 'other':
                        gender = "OTHER";
                        break;
                    default:
                        gender = "OTHER";
                }
            } else {
                gender = "OTHER"
            }
            PersonalData.GetUserProfile.gender = gender;
            PersonalData.GetUserProfile.photo = authData.facebook.cachedUserProfile.picture.data.url || false;
            localforage.setItem('userProfile', PersonalData.GetUserProfile)
                .then(function () {
                    _syncDataPostAuth();
                    $state.go('app.extra-info', {isSignup: isSignup});
                    $rootScope.data.loading = false;
                    if (isSignup) {
                        _addNewUserToSegmentQueue();
                    }
                });
            WorkoutService.unlockForCreateUserAccount()
                .then(WorkoutService.manageDownloads);
        };

        var _googlePostAuthProcess = function (authData, isSignup) {
                PersonalData.GetUserProfile.uid = authData.uid;
                PersonalData.GetUserProfile.email = authData.google.email || '';
                PersonalData.GetUserProfile.firstName = authData.google.cachedUserProfile.given_name || '';
                PersonalData.GetUserProfile.lastName = authData.google.cachedUserProfile.family_name || '';
                PersonalData.GetUserProfile.locale = authData.google.cachedUserProfile.locale || '';
                PersonalData.GetUserProfile.authType = 'google';
                PersonalData.GetUserProfile.groupCode = authData.groupCode || null;
                var gender = '';
                if (authData.google.cachedUserProfile.gender) {
                    switch (authData.google.cachedUserProfile.gender.toLowerCase()) {
                        case 'male':
                            gender = "MALE";
                            break;
                        case 'female':
                            gender = "FEMALE";
                            break;
                        case 'other':
                            gender = "OTHER";
                            break;
                        default:
                            gender = "OTHER";
                    }
                } else {
                    gender = "OTHER"
                }
                PersonalData.GetUserProfile.gender = gender;
                PersonalData.GetUserProfile.photo = authData.google.cachedUserProfile.picture || false;
                localforage.setItem('userProfile', PersonalData.GetUserProfile)
                    .then(function () {
                        _syncDataPostAuth();
                        $state.go('app.extra-info', {isSignup: isSignup});
                        $rootScope.data.loading = false;
                        if (isSignup) {
                            _addNewUserToSegmentQueue();
                        }
                    });
                WorkoutService.unlockForCreateUserAccount()
                    .then(WorkoutService.manageDownloads);
            }
            ;

        var _addNewUserToQueue = function () {
            var firebaseUID = FirebaseService.getUserUID();
            if (firebaseUID !== null) {
                FirebaseService.ref.child(firebaseUID).once('value', function (snapshot) {
                    if (snapshot.child('userProfile').exists()) {
                        FirebaseService.queueRef.child(firebaseUID).update({
                            data: {
                                timingSettings: TimingData.GetTimingSettings,
                                timingSevenSettings: TimingData.GetSevenMinuteSettings,
                                userGoals: PersonalData.GetUserGoals,
                                userProfile: PersonalData.GetUserProfile,
                                userSettings: PersonalData.GetUserSettings
                            },
                            action: 'create',
                            event: 'sign_up'
                        });
                    }
                });
            }
        };

        var _addNewUserToSegmentQueue = function () {
            var firebaseUID = FirebaseService.getUserUID();
            if (firebaseUID !== null) {
                FirebaseService.ref.child(firebaseUID).once('value', function (snapshot) {
                    FirebaseService.queueRef.child(firebaseUID).update({
                        data: {
                            uid: firebaseUID
                        },
                        action: 'create',
                        event: 'segment'
                    });
                });
            }
        };

        return {

            logOut: function () {
                WorkoutService.lockForLogOutAccount();
                FirebaseService.auth.$unauth();
                FirebaseService.authData = null;
                AccessService.refreshCache();
                PersonalData.GetUserProfile = {
                    email: '',
                    firstName: '',
                    lastName: '',
                    gender: '',
                    emailPreference: true,
                    birthYear: '',
                    photo: false,
                    authType: '',
                    locale: '',
                    goals: [],
                    groupCode: null
                };
                localforage.setItem('userProfile', PersonalData.GetUserProfile);
                //TODO: The workouts stay in storage, but we probably need to remove the sync_id so that they don't get deleted if another user logs in
                localforage.keys(function (keys) {
                    // Returns array of all the localforage key names, old localforage syntax needed
                    angular.forEach(keys, function (value) {
                        if (value.indexOf("sync_") > -1) {
                            localforage.removeItem(value, function () {
                                console.log('Removed localforage sync item: ', value);
                            })
                        }
                    })
                });
            },

            facebookAuthProcess: function (isSignup) {
                $rootScope.data.loading = true;
                if ($window.device) {
                    facebookConnectPlugin.login(['public_profile', 'email'], function () {
                        facebookConnectPlugin.getAccessToken(function (token) {
                            // Authenticate with Facebook using an existing OAuth 2.0 access token
                            FirebaseService.auth.$authWithOAuthToken("facebook", token)
                                .then(function (authData) {
                                    $log.info('Authenticated successfully with payload:', authData);
                                    if (typeof authData.facebook.cachedUserProfile.email !== "undefined") {
                                        _facebookPostAuthProcess(authData, authData.facebook.cachedUserProfile.email, isSignup);
                                    } else {
                                        var emailPopup = $ionicPopup.show({
                                            title: $translate.instant('EMAILREQ'),
                                            template: '<form name="signInForm" novalidate><p style="margin-left:10px;">' + $translate.instant("VALIDEMAIL") + ':</p><input type="email" autofocus class="ng-pristine ng-valid" placeholder="' + $translate.instant("EMAILADD") + '" required name="email"></form>',
                                            buttons: [
                                                {
                                                    text: $translate.instant('CANCEL_SM'),
                                                    onTap: function () {
                                                        FirebaseService.auth.$unauth();
                                                        $rootScope.data.loading = false;
                                                        emailPopup.close();
                                                    }
                                                },
                                                {
                                                    text: $translate.instant('SAVE'),
                                                    type: 'energized',
                                                    onTap: function (e) {
                                                        var res = signInForm.email.value;
                                                        angular.element(signInForm).addClass('ng-submitted');
                                                        if (res && res.length > 1 && signInForm.email.checkValidity()) {
                                                            _facebookPostAuthProcess(authData, res, isSignup);
                                                            emailPopup.close();
                                                        } else {
                                                            e.preventDefault();
                                                        }
                                                    }
                                                }
                                            ]
                                        });
                                    }
                                }).catch(function (error) {
                                console.error("Authentication failed:", error);
                            });
                        }, function (error) {
                            console.log('Could not get access token', error);
                        });
                    }, function (error) {
                        console.log('An error occurred logging the user in', error);
                    });

                } else {

                    FirebaseService.auth.$authWithOAuthPopup("facebook", {scope: "email"})
                        .then(function (authData) {
                            //console.log("Logged in as:", authData.uid);
                            //console.log("Auth Data is: ", authData);
                            if (typeof authData.facebook.cachedUserProfile.email !== "undefined") {
                                _facebookPostAuthProcess(authData, authData.facebook.cachedUserProfile.email);
                            } else {
                                var emailPopup = $ionicPopup.show({
                                    title: $translate.instant('EMAILREQ'),
                                    template: '<form name="signInForm" novalidate><p style="margin-left:10px;">' + $translate.instant("VALIDEMAIL") + ':</p><input type="email" autofocus class="ng-pristine ng-valid" placeholder="' + $translate.instant("EMAILADD") + '" required name="email"></form>',
                                    buttons: [
                                        {
                                            text: $translate.instant('CANCEL_SM'),
                                            onTap: function () {
                                                FirebaseService.auth.$unauth();
                                                $rootScope.data.loading = false;
                                                emailPopup.close();
                                            }
                                        },
                                        {
                                            text: $translate.instant('SAVE'),
                                            type: 'energized',
                                            onTap: function (e) {
                                                var res = signInForm.email.value;
                                                angular.element(signInForm).addClass('ng-submitted');
                                                if (res && res.length > 1 && signInForm.email.checkValidity()) {
                                                    _facebookPostAuthProcess(authData, res);
                                                    emailPopup.close();
                                                } else {
                                                    e.preventDefault();
                                                }
                                            }
                                        }
                                    ]
                                });
                            }
                        }).catch(function (error) {
                        $rootScope.data.loading = false;
                        console.log("Authentication failed:", error);
                    });

                }
            },

            googleAuthProcess: function (isSignup) {
                $rootScope.data.loading = true;
                FirebaseService.auth.$authWithOAuthPopup("google", {scope: "email"})
                    .then(function (authData) {
                        //console.log("Logged in as:", authData.uid);
                        //console.log("Auth Data is: ", authData);
                        _googlePostAuthProcess(authData, isSignup);
                    }).catch(function (error) {
                    $rootScope.data.loading = false;
                    console.log("Authentication failed:", error);
                });

            },

            facebookPostAuthProcess: _facebookPostAuthProcess,

            googlePostAuthProcess: _googlePostAuthProcess,

            addNewUserToQueue: _addNewUserToQueue,

            addNewUserToSegmentQueue: _addNewUserToSegmentQueue,

            syncDataPostAuth: _syncDataPostAuth

        }

    }
);



	