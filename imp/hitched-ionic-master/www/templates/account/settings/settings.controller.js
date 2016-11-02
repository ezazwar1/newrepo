'use strict';

angular.module('HitchedApp')
    .controller('SettingsCtrl', function($scope, $modalInstance, User, Auth) {
        $scope.errors = {};
        $scope.success = false;
        $scope.emailSubmitted = false;
        $scope.passwordSubmitted = false;

        // Get the wedding information
        Auth.getCurrentUser().$promise.then(function(user) {
            $scope.currentUser = user;
        });

        $scope.close = function() {
            $modalInstance.close();
        };

        $scope.editEmail = false;
        $scope.editEmailInit = function() {
            $scope.editEmail = !$scope.editEmail;
        };

        $scope.editPassword = false;
        $scope.editPasswordInit = function() {
            $scope.editPassword = !$scope.editPassword;
        };

        $scope.changeEmail = function(form) {
            $scope.emailSubmitted = true;

            if (form.$valid) {
                Auth.changeEmail($scope.currentUser.email)
                    .then(function() {
                        $scope.message = 'Email updated.';
                        $scope.editEmail = false;
                        $scope.success = true;
                    })
                    .catch(function(err) {
                        form.email.$setValidity('mongoose', false);
                        $scope.errors.other = 'Issue with email';
                        $scope.message = '';
                        $scope.success = false;
                        console.log(err);
                    });
            }
        };

        $scope.changePassword = function(form) {
            $scope.passwordSubmitted = true;
            if (form.$valid) {
                Auth.changePassword($scope.currentUser.password)
                    .then(function() {
                        $scope.message = 'Password successfully changed.';
                        $scope.editPassword = false;
                        $scope.success = true;
                        delete $scope.currentUser.password;
                        delete $scope.currentUser.newPassword;
                    })
                    .catch(function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Error: Password not saved.';
                        $scope.message = '';
                        $scope.success = false;
                    });
            }
        };
    });