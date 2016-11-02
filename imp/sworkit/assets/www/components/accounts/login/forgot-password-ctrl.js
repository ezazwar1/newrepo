angular.module('swMobileApp').controller('ForgotPasswordCtrl', function ($scope, $translate, $location, FirebaseService) {

    $scope.user = {
        email: null,
        password: null
    }

    $scope.data = {
        loading: false
    }

    $scope.error = false;

    $scope.requestNewPassword = function () {
        $scope.data.loading = true;
        FirebaseService.auth.$resetPassword({
                email: $scope.user.email
            })
            .then(function () {
                console.log("Password reset email sent successfully!");
                $scope.error = $translate.instant('PASS_SENT');
                $scope.data.loading = false;
                $location.path('/app/auth/edit-profile');
            })
            .catch(function (error) {
                $scope.error = $translate.instant(error.code);
                console.error("Error: ", error);
                $scope.data.loading = false;
            });
    };
});

