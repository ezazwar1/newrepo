angular.module('swMobileApp').controller('SignUpCtrl', function ($rootScope, $scope, $state, $timeout, $ionicPopup, $translate, FirebaseService, AppSyncService, AccountsService, WorkoutService, $window, $stateParams, swAnalytics, $log) {

    $scope.user = {
        email: null,
        password: null,
        firstName: null,
        lastName: null,
        gender: '',
        birthYear: '',
        photo: '',
        emailPreference: true
    };

    $rootScope.data = {
        loading: false
    };

    $scope.submitted = false;
    $scope.error = false;
    $scope.authUnavailable = false;

    $scope.signupEmail = function (signUpForm) {
        if (signUpForm.$valid) {
            $rootScope.data.loading = true;
            FirebaseService.auth.$createUser($scope.user)
                .then(function (userData) {
                    FirebaseService.auth.$authWithPassword($scope.user)
                        .then(function (authDataLogin) {
                            $log.debug("Logged in as:", authDataLogin.uid);
                            $scope.setSignUpDateLang();
                            PersonalData.GetUserProfile.uid = authDataLogin.uid;
                            PersonalData.GetUserProfile.email = $scope.user.email;
                            PersonalData.GetUserProfile.firstName = $scope.user.firstName;
                            PersonalData.GetUserProfile.lastName = $scope.user.lastName;
                            PersonalData.GetUserProfile.emailPreference = $scope.user.emailPreference;
                            PersonalData.GetUserProfile.authType = 'email';
                            PersonalData.GetUserProfile.locale = navigator.language || '';
                            localforage.setItem('userProfile', PersonalData.GetUserProfile)
                                .then(function () {
                                    AccountsService.syncDataPostAuth();
                                    $state.go('app.extra-info', {isSignup: true});
                                    $rootScope.data.loading = false;
                                    AccountsService.addNewUserToSegmentQueue();
                                });
                            swAnalytics.trackEvent('kpi', 'activation', 'registration');
                            trackEvent('User Registration', 'email', 0);
                            if ($window.device) {
                                WorkoutService.unlockForCreateUserAccount()
                                    .then(WorkoutService.manageDownloads);
                                FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event1);
                            }
                        }).catch(function (error) {
                        $log.error("Authentication failed:", error);
                        $rootScope.data.loading = false;
                    });
                    $scope.message = "User created with uid: " + userData.uid;
                    $rootScope.data.loading = false;
                }).catch(function (error) {
                $log.error("error", error);
                $scope.error = $translate.instant(error.code);
                $rootScope.data.loading = false;
                if (error.code == 'AUTHENTICATION_DISABLED' || error.code == 'INVALID_CONFIGURATION' || error.code == 'NETWORK_ERROR' || error.code == 'PROVIDER_ERROR' || error.code == 'TRANSPORT_UNAVAILABLE' || error.code == 'UNKNOWN_ERROR') {
                    $scope.authUnavailable = true;
                }
            });
        } else {
            signUpForm.submitted = true;
            $log.debug($scope.signUpForm);
        }
    };

    $scope.facebookSignUp = function () {
        $scope.setSignUpDateLang();
        AccountsService.facebookAuthProcess($stateParams.isSignup);
        swAnalytics.trackEvent('kpi', 'activation', 'registration');
        trackEvent('User Registration', 'facebook', 0);
        if ($window.device) {
            FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event1);
        }
    };

    $scope.googleSignUp = function () {
        $scope.setSignUpDateLang();
        AccountsService.googleAuthProcess($stateParams.isSignup);
        swAnalytics.trackEvent('kpi', 'activation', 'registration');
        trackEvent('User Registration', 'google', 0);
        if ($window.device) {
            FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event1);
        }
    };

    $scope.openPrivacy = function () {
        window.open('http://m.sworkit.com/privacy.html', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };

    $scope.openTerms = function () {
        window.open('http://m.sworkit.com/TOS.html', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };

    $scope.$on('$ionicView.enter', function () {
        if (device) cordova.plugins.Keyboard.disableScroll(true);
    });
    $scope.$on('$ionicView.leave', function () {
        if (device) cordova.plugins.Keyboard.disableScroll(false);
    });

    $scope.setSignUpDateLang = function () {
        var dateNow = new Date();
        PersonalData.GetUserProfile.signUpDate = dateNow.getTime();
        PersonalData.GetUserProfile.defaultLang = PersonalData.GetUserSettings.preferredLanguage;
    }

});
