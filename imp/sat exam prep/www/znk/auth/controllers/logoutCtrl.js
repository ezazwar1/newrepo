'use strict';

(function () {

    angular.module('znk.sat').controller('LogoutCtrl', ['$state', 'AuthSrv', 'FirebaseFacebookSrv', '$stateParams', '$location', LogoutCtrl]);


    function LogoutCtrl($state, AuthSrv, FirebaseFacebookSrv, $stateParams, $location) {

        if($stateParams.provider === "facebook" && $location.$$host !== "localhost") {
            FirebaseFacebookSrv.facebookLogoutViaPlugin().then(function() {
                logoutHandler();
            }, function(error) {
                
                logoutHandler();
            });
        } else {
            logoutHandler();
        }


        function logoutHandler() {
            AuthSrv.logout();
            $state.go('welcome');
        }

    }

})();
