'use strict';

(function (angular) {

    angular.module('znk.sat').controller('ChangePasswordCtrl', [
        '$scope', '$state', '$timeout', 'AuthSrv', 'NetworkSrv', 'ErrorHandlerSrv', 'GoBackHardwareSrv', ChangePasswordCtrl]);

        function ChangePasswordCtrl($scope, $state, $timeout, AuthSrv, NetworkSrv, ErrorHandlerSrv, GoBackHardwareSrv) {

            $scope.d = {};

            function isValidUserInput(d) {

                if (!d.changePasswordForm.$valid) {
                    ErrorHandlerSrv.displayErrorMsg('Please insert password.');
                    return false;
                }

                if (d.newPassword !== d.newPasswordConfirm) {
                    ErrorHandlerSrv.displayErrorMsg("Passwords doesn't match");
                    return false;
                }

                return true;
            }

            function changePassword(d) {
                d.startLoader = true;
                var changePasswordData = {
                    email: AuthSrv.authentication.email,
                    newPassword: d.newPassword,
                    oldPassword: d.currentPassword
                };

                AuthSrv.changePassword(changePasswordData).then(function (response) {
                    d.fillLoader = true;
                    $timeout(function () {
                        d.startLoader = d.fillLoader = false;
                        GoBackHardwareSrv.registerClosePopupAndGoHomeHandler();
                        ErrorHandlerSrv.displaySuccessMsg('You\'ve successfully changed your password.', true, 'CHANGE PASSWORD').then(function () {
                            $state.go('app.home');
                        });
                    }, 100);
                },
                function (err) {
                    d.fillLoader = true;
                    $timeout(function () {
                        d.startLoader = d.fillLoader = false;
                        ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.handleError(err).message);
                    }, 100);
                });
            }

            $scope.d.passwordPattern = /^[a-zA-Z0-9]{6,}$/;

            $scope.d.onClickDone = function () {

                if (NetworkSrv.isDeviceOffline()) {
                    ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                    return;
                }
                else {

                    if (!isValidUserInput($scope.d)) return;

                    changePassword($scope.d);
                }
            };
        }

})(angular);
