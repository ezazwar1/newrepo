'use strict';

/**
* @ngdoc controller
* @name auth.module.controller:AuthMainCtrl
* @requires $scope
* @requires $stateParams
* @requires $state
* @requires $localStorage
* @requires AuthService
* @description
* Starts social api athentication flows.
*/
angular
    .module('auth.module')
    .controller('AuthMainCtrl', function ($scope, $stateParams, $state, $localStorage, AuthService) {
        var vm = this;

        // implement google authentication here
        $scope.googleLogin = function () {

            AuthService.Auth("google").then(function (data) {
                loadUserData(data.id);
                $scope.goBack();
            }, function (data) {
                alert(data.error);
            });
        }

        // implement facebook authentication here
        $scope.facebookLogin = function () {

            AuthService.Auth("facebook").then(function (data) {
                loadUserData(data.id);
                $scope.goBack();
            }, function (data) {
                alert(data.error);
            });
        }

        // implement twitter authentication here
        $scope.twitterLogin = function () {

            AuthService.Auth("twitter").then(function (data) {
                loadUserData(data.id);
                $scope.goBack();
            }, function (data) {
                alert(data.error);
            });
        }

        $scope.goBack = function () {
            var backState = $stateParams.back;
            if (angular.isString(backState))
                $state.go(backState);
            else
                $state.go("welcome");
        }

        var loadUserData = function (id) {
            AuthService.LoadUserData(id).then(function (data) {
                $localStorage.user = $localStorage.user || {};
                $localStorage.user = data.customer_info;
            }, function (data) {
                alert(data.error);
            });
        }
    });