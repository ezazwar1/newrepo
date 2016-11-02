cordova.define("com.viceversa.TwitterPlugin.TwitterPlugin", function(require, exports, module) { 	var exec = require('cordova/exec');
    var pluginNativeName = "TwitterPlugin";
               
    var TwitterPlugin = function () {
    };

               
    TwitterPlugin.prototype = {
    	
		login : function(successCallback, errorCallback) {
			exec(successCallback,errorCallback,pluginNativeName,'login', []);
		}
    };
	
               
    module.exports = new TwitterPlugin();



});
