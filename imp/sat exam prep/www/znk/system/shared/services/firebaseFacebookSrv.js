'use strict';

(function (angular) {

    angular.module('znk.sat').factory('FirebaseFacebookSrv',  ['ENV', '$q', '$window', 'StorageSrv','$cordovaFacebook', 'UserProfileSrv', FirebaseFacebookSrv]);

    function FirebaseFacebookSrv(ENV, $q, $window, StorageSrv, $cordovaFacebook, UserProfileSrv) {

        var FirebaseFacebookSrv = {};

        FirebaseFacebookSrv.firebaseInstance =  null;

        FirebaseFacebookSrv.getInstanceSingleton = function() {

            if(this.firebaseInstance === null) {
                this.firebaseInstance = new Firebase(ENV.fbEndpoint);
            }

            return this.firebaseInstance;
        };

        FirebaseFacebookSrv.authPopup = function(obj) {

            var deferred = $q.defer();
            var scope = obj.scope || "email";
            var ref = this.getInstanceSingleton();

            ref.authWithOAuthPopup("facebook", function(error, authData) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(authData);
                }
            }, {
                scope: scope
            });


            return deferred.promise;
        };

        FirebaseFacebookSrv.shareWithDialogViaPlugin = function(options) {

            var deferred = $q.defer();

            $cordovaFacebook.showDialog(options)
                .then(function(success) {
                    deferred.resolve(success);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        FirebaseFacebookSrv.authRedirect = function(obj) {

            var deferred = $q.defer();
            var scope = obj.scope || "email";
            var ref = this.getInstanceSingleton();

            ref.authWithOAuthRedirect("facebook", function(error) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                }
            }, {
                scope: scope
            });


            return deferred.promise;
        };

        FirebaseFacebookSrv.facebookConnectViaPlugin = function(obj){

            var deferred = $q.defer();
            var scope = obj.scope || ["public_profile", "email", "user_friends"];

            $cordovaFacebook.login(scope).then(function(basic) {
                $cordovaFacebook.api("me", scope)
                    .then(function(success) {
                        var info = angular.extend(success,basic);
                        deferred.resolve(info);
                    }, function (error) {
                        deferred.reject(error);
                    });
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        FirebaseFacebookSrv.facebookLogoutViaPlugin = function() {

            var deferred = $q.defer();

            $cordovaFacebook.logout().then(function(success) {
                deferred.resolve(success);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        FirebaseFacebookSrv.createUser = function(obj) {

            var deferred = $q.defer();
            var ref = this.getInstanceSingleton();


            ref.authWithOAuthToken("facebook", obj.access_token, function(error, authData) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(authData);
                }
            });

            return deferred.promise;
        };


        FirebaseFacebookSrv.set = function(userData, initUserProfile) {
            return StorageSrv.set('users/'+userData.uid, {
                serverCreatedAt: $window.Firebase.ServerValue.TIMESTAMP
            }).then(function(res){
                return UserProfileSrv.save(initUserProfile);
            });
        };

        FirebaseFacebookSrv.get = function(uid) {

            var deferred = $q.defer();

            StorageSrv.get('users/'+uid).then(function(res){
                deferred.resolve(res);
            },function(err){
                deferred.reject(err);
            });

            return deferred.promise;

        };



        return FirebaseFacebookSrv;
    }

})(angular);
