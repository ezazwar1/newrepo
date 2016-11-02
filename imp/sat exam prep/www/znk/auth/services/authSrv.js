'use strict';

(function () {

    angular.module('znk.sat').factory('AuthSrv', [
        '$q', 'localStorageService', 'ENV', '$analytics', '$firebaseAuth', '$window', '$rootScope', '$timeout',

    function ($q, localStorageService, ENV, $analytics, $firebaseAuth, $window, $rootScope, $timeout) {

        var fbAuth = $firebaseAuth(new $window.Firebase(ENV.fbEndpoint));
        var envPrefix = ENV.fbEndpoint.substring(ENV.fbEndpoint.indexOf('/') + 2, ENV.fbEndpoint.indexOf('.'));
        var AUTH_STORAGE_KEY = envPrefix + '.authorizationData';

        var AuthSrv = {
            authentication: {
                isAuth: false,
                uid: '',
                email: '',
                token: '',
                expires: ''
            }
        };

        AuthSrv.fillAuthData = function () {

            var authData = localStorageService.get(AUTH_STORAGE_KEY);
            if (authData) {
                AuthSrv.authentication.isAuth = authData.isAuth;
                AuthSrv.authentication.uid = authData.uid;
                AuthSrv.authentication.email = authData.email;
                AuthSrv.authentication.token = authData.token;
                AuthSrv.authentication.expires = authData.expires;
            }
        };

        fbAuth.$onAuth(function (data) {

            if (data) {
                _sucessLogin(data);
                $rootScope.$broadcast('auth:login', data);

            } else {
                $rootScope.$broadcast('auth:logout');
            }
        });

        var _sucessLogin = function (authData) {
            AuthSrv.authentication.isAuth = true;
            AuthSrv.authentication.uid = authData.uid;
            AuthSrv.authentication.email = authData[authData.provider].email;
            AuthSrv.authentication.token = authData.token;
            AuthSrv.authentication.expires = authData.expires;
            localStorageService.set(AUTH_STORAGE_KEY, AuthSrv.authentication);

            $analytics.setUsername(AuthSrv.authentication.uid);
            $analytics.setUserProperties(AuthSrv.authentication.uid, {
                email: AuthSrv.authentication.email,
                name: AuthSrv.authentication.email,
                deviceModel: ENV.deviceModel,
                deviceUuid: ENV.deviceUuid,
                platform: ionic.Platform.platform()
            });
        };

        var registrationAnalytics = function(userData){

            $analytics.setAlias(userData.uid);
            $analytics.eventTrack('registration', { category: 'Auth', label: userData.uid });

            if ($window.facebookConnectPlugin){
                $window.facebookConnectPlugin.logEvent('CompletedRegistration', { RegistrationMethod: 'email' }, null, function(){
                });
            }
         };

        AuthSrv.saveRegistration = function (registration) {
            var registerInProgress = true;
            var dfd = $q.defer();
            AuthSrv.logout(true);

            var timeoutPromise = $timeout(function(){
                if (registerInProgress){
                    
                    dfd.reject('timeout');
                }
            },12000);

            fbAuth.$createUser(registration).then(function (userData) {
                registerInProgress=false;
                $timeout.cancel(timeoutPromise);
                registrationAnalytics(userData);

                if ($window.plugins && $window.plugins.matPlugin){
                    $window.plugins.matPlugin.setUserEmail(registration.email);
                    $window.plugins.matPlugin.measureEvent('registration');
                }
                var initUserProfile = {
                    'email': registration.email,
                    'nickname': registration.nickname
                };
                var fbRef = new $window.Firebase(ENV.fbEndpoint);
                fbRef.child('users/' + userData.uid).set({
                    serverCreatedAt: $window.Firebase.ServerValue.TIMESTAMP,
                    profile: initUserProfile,
                    platform: ionic.Platform.platform()
                }, function (error) {
                    if (error) {
                        dfd.reject(error);
                    } else {
                        dfd.resolve();
                    }
                });
            }, function(error){
                
                $timeout.cancel(timeoutPromise);
                dfd.reject(error);
            });
            return dfd.promise;
        };

        AuthSrv.login = function (loginData) {

            var deferred = $q.defer();

            fbAuth.$unauth();

            fbAuth.$authWithPassword(loginData).then(function (authData) {
                // handled @ fbAuth.$onAuth(...)
                deferred.resolve(authData);
            }).catch(function (err) {
                AuthSrv.logout();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        AuthSrv.forgotPassword = function (forgotPasswordData) {
            return (fbAuth.$resetPassword(forgotPasswordData));
        };

        AuthSrv.changePassword = function (changePasswordData) {
            return fbAuth.$changePassword(changePasswordData);
        };

        AuthSrv.logout = function (shouldNotTrack) {
            $rootScope.$broadcast('auth:beforeLogout');
            if (!shouldNotTrack){
                $analytics.eventTrack('logout', { category: 'logout'});
            }

            fbAuth.$unauth();
            localStorageService.remove(AUTH_STORAGE_KEY);
            AuthSrv.authentication = {
                isAuth: false,
                uid: '',
                email: '',
                token: '',
                expires: ''
            };
        };

        return AuthSrv;
    }]);
})();
