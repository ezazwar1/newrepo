/**
 * Created by patrick on 3/3/15.
 */

(function () {
    'use strict';

    angular.module('shiptApp').controller('RegisterController', [
        '$scope',
        '$log',
        '$rootScope',
        'UIUtil',
        'AuthService',
        'LogService',
        'ErrorHandler',
        'AppAnalytics',
        'Registration',
        RegisterController]);

    function RegisterController($scope,
                                $log,
                                $rootScope,
                                UIUtil,
                                AuthService,
                                LogService,
                                ErrorHandler,
                                AppAnalytics,
                                Registration) {

        $log.info('LoginController loaded');

        AppAnalytics.track('registerModalStart');
        $scope.invalidLogin = false;
        $scope.login = {
            username: null,
            password: null
        };

        $scope.invalidRegisterMessage = "Registration Invalid";
        $scope.errorRegisterMessage = "There was an error.";

        $scope.registerSubmit = function(registerData) {
            var validationErrors = Registration.validate(registerData);
            if(validationErrors.length === 0) { // Validation passed
                UIUtil.showLoading();
                var newUserData = angular.copy(registerData);
                var builtRegistrationData = Registration.build(newUserData);
                AuthService.registerUser(builtRegistrationData)
                    .then(function(data){
                        registerData = null;
                        $scope.register = null;
                        $scope.loginError = false;
                        $scope.invalidLogin = false;
                        //fire off the event telling the app that there has been a successful login
                        $rootScope.$broadcast('user.registered', data);
                    },function(error){
                        if (error.errors && error.errors.zip_code) {
                            //handle custom messaging for zip code errors.
                            ErrorHandler.displayShiptAPIError(null, `Oh no!`, error.errors.zip_code[0]);
                        } else {
                            ErrorHandler.displayShiptAPIError(error);
                        }
                        if (error) {
                            $scope.invalidLogin = true;
                            $scope.loginError = false;
                        } else {
                            $scope.loginError = true;
                            $scope.invalidLogin = false;
                        }
                        AppAnalytics.track('registration_error',{
                            errors: error.errors,
                            zip_code: builtRegistrationData.zip_code,
                            email: builtRegistrationData.email
                        });
                    })
                    .finally(function() {
                        UIUtil.hideLoading();
                    });
            } else { // Validation errors
                UIUtil.showMultiErrorAlert(validationErrors);
            }
        };

        $scope.signUp = function(){
            $log.info('signup');
        };

        $scope.cancelRegister = function(){
            $rootScope.$broadcast('cancel-register');
        };

    }
})();
