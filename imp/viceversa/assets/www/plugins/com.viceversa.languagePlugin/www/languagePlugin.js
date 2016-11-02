cordova.define("com.viceversa.languagePlugin.languagePlugin", function(require, exports, module) { var exec = require('cordova/exec');
var pluginNativeName = "languagePlugin";
           
var languagePlugin = function () {};
languagePlugin.prototype.getCurrentLanguage = function(successCallback, errorCallback) {
	exec(successCallback,errorCallback,pluginNativeName,'getCurrentLanguage',[]);
};
languagePlugin.prototype.getAllLanguage = function(successCallback, errorCallback) {
	exec(successCallback,errorCallback,pluginNativeName,'getAllLanguage',[]);
};

module.exports = new languagePlugin();



});
