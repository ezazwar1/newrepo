'use strict';

angular.module('HitchedApp')
  .controller('LoginCtrl', function($scope, $modalInstance, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.signup = function() {
      $modalInstance.close({
        template: 'signup',
        ctrl: 'SignupCtrl'
      });
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function() {
            // Logged in, redirect to home
            $location.path('/dashboard');
            $modalInstance.close();
          })
          .catch(function(err) {
            $scope.errors.other = err.message;
          });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });