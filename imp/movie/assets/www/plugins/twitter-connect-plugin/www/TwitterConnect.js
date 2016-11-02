cordova.define("twitter-connect-plugin.TwitterConnect", function(require, exports, module) {
var exec = require('cordova/exec');

var TwitterConnect = {
	login: function (successCallback, errorCallback) {
		exec(successCallback, errorCallback, 'TwitterConnect', 'login', []);
	},
	logout: function (successCallback, errorCallback) {
		exec(successCallback, errorCallback, 'TwitterConnect', 'logout', []);
	}
};

module.exports = TwitterConnect;
});
