angular.module('swMobileApp').controller('LoginCtrl', function ($rootScope, $scope, FirebaseService, AppSyncService, AccountsService, $state, $timeout, $ionicPopup, $translate, WorkoutService, $log) {

    $scope.user = {
        email: null,
        password: null,
        firstName: null,
        lastName: null,
        gender: null,
        photo: null
    };

    $rootScope.data = {
        loading: false
    };

    $scope.facebookSignIn = function () {
        AccountsService.facebookAuthProcess();
    };

    $scope.googleSignIn = function () {
        AccountsService.googleAuthProcess();
    };

    $scope.error = false;
    $scope.authUnavailable = false;

    $scope.loginEmail = function () {
        $scope.data.loading = true;
        FirebaseService.auth.$authWithPassword($scope.user)
            .then(function (authData) {
                $log.debug("Logged in as:", authData.uid);
                localforage.setItem('userProfile', PersonalData.GetUserProfile)
                    .then(function () {
                        AccountsService.syncDataPostAuth();
                        $state.go('app.extra-info');
                        $rootScope.data.loading = false;
                    });
                WorkoutService.unlockForCreateUserAccount()
                    .then(WorkoutService.manageDownloads);
            })
            .catch(function (error) {
                $log.error("Authentication failed:", error);
                $scope.error = $translate.instant(error.code);
                $scope.data.loading = false;
                if (error.code == 'AUTHENTICATION_DISABLED' || error.code == 'INVALID_CONFIGURATION' || error.code == 'NETWORK_ERROR' || error.code == 'PROVIDER_ERROR' || error.code == 'TRANSPORT_UNAVAILABLE' || error.code == 'UNKNOWN_ERROR') {
                    $scope.authUnavailable = true;
                }
            });
    };

    $scope.openPrivacy = function ($event) {
        window.open('http://m.sworkit.com/privacy.html', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };

    $scope.openTerms = function ($event) {
        window.open('http://m.sworkit.com/TOS.html', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
    };

});
