
var ParsePlugin = angular.module('ParsePlugin', []);

ParsePlugin.factory('parsePlugin', function() {

    var parsePlugin = {};

    parsePlugin.setForUserInInstallation = function(userID, successCallback, errorCallback) {
         cordova.exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'ParsePlugin', 
            'setForUserInInstallation', // with this action name
            [{                  // and this array of custom arguments to create our entry
                "forUserID": userID,
            }]
        ); 
     }


     return parsePlugin;
});
