'use strict';

(function () {
    angular.module('znk.sat').factory('UserProfileSrv', ['StorageSrv', '$q', '$filter', UserProfileSrv]);

    function UserProfileSrv(StorageSrv, $q, $filter ) {

        var profilePath = StorageSrv.globalUserSpacePath.concat(['profile']);

        function get() {
            return StorageSrv.get(profilePath).then(function (profileSync) {
                return profileSync;
            });
        }

        function save(userProfile) {
            return StorageSrv.set(profilePath, userProfile).then(function () {
                updateUserDisplayName(userProfile);
                return userProfile;
            });
        }

        function updateUserDisplayName(userProfile) {
            if (userProfile.firstName && userProfile.lastName) {
                factoryObj.profileUserDisplayName = userProfile.firstName + ' ' + userProfile.lastName;
            }
            else {
                factoryObj.profileUserDisplayName = undefined;
            }
            return $q.when(factoryObj.profileUserDisplayName);
        }

        var factoryObj = {
            get: get,
            save: save
        };
        return factoryObj;
    }

})();
