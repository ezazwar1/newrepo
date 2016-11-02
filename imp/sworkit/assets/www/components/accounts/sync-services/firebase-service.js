angular.module('swMobileApp').factory('FirebaseService', function ($firebaseAuth, $rootScope, $log) {
    $rootScope.authData = null;

    var ref = new Firebase("https://sworkit-user.firebaseio.com/users");
    var groupsRef = new Firebase("https://sworkit-user.firebaseio.com/groups");
    var queueRef = new Firebase("https://sworkit-user.firebaseio.com/queue/tasks");
    var auth = $firebaseAuth(ref);
    $log.debug("Firebase auth", auth);

    function _getUserUID() {
        return ref.getAuth() ? ref.getAuth().uid : null;
    }

    var returnObj = {
        ref: ref,
        groupsRef: groupsRef,
        queueRef: queueRef,
        getUserUID: _getUserUID,
        auth: auth,
        user: ref.getAuth(),
        authData: ref.getAuth()
    };

    auth.$onAuth(function (authData) {
        delete returnObj.user;
        if (angular.isObject(authData)) {
            $log.debug("Logged in as:", authData.uid);
            $rootScope.authData = returnObj.authData = authData;
            returnObj.user = ref.getAuth();
        } else {
            $log.debug("Logged out");
            $rootScope.authData = null;
            // TODO: authDataPromise so that we can migrate if statement checks for FirebaseService.authData to promises
        }
    });

    // TODO: When app starts, login with token from local storage (if present)
    return returnObj;

});
