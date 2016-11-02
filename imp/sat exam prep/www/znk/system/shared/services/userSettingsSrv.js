'use strict';
(function () {
    angular.module('znk.sat').factory('UserSettingsSrv', [
        'StorageSrv',
        function (StorageSrv) {
            var UserSettingsSrv = {};

            var settingsPath = StorageSrv.appUserSpacePath.concat(['userSettings']);

            UserSettingsSrv.getUserSettings = function(){
                return StorageSrv.get(settingsPath).then(function(userSettings){
                    var defaultValues = {
                        soundEnabled: true
                    };
                    for(var prop in defaultValues){
                        if(angular.isUndefined(userSettings[prop])){
                            userSettings[prop] = defaultValues[prop];
                        }
                    }
                    return userSettings;
                });
            };

            UserSettingsSrv.setUserSettings = function(newUserSettings){
                return StorageSrv.set(settingsPath,newUserSettings);
            };

            UserSettingsSrv.soundEnabled = function(newValue){
                return UserSettingsSrv.getUserSettings().then(function(userSettings){
                    if(angular.isDefined(newValue)){
                        userSettings.soundEnabled = newValue;
                        UserSettingsSrv.setUserSettings(userSettings);
                    }
                   return !!userSettings.soundEnabled;
                });
            };
            return UserSettingsSrv;
        }
    ]);
})();
