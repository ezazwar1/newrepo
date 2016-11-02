cordova.define("com.viceversa.ParseSaveEventually.ParseSaveEventually", function(require, exports, module) { 	var exec = require('cordova/exec');
    var pluginNativeName = "ParseSaveEventually";
               
    var ParseSaveEventually = function () {
    };

    ParseSaveEventually.prototype = {
		saveEventually: function(objectId, successCallback, errorCallback) {
			exec(successCallback, errorCallback, pluginNativeName, 'saveEventually', [objectId]);
		}
    };
	   
    module.exports = new ParseSaveEventually();



});
