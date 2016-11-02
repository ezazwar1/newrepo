cordova.define("com.viceversa.imageCombine.ImageCombine", function(require, exports, module) { var exec = require('cordova/exec');
var pluginNativeName = "ImageCombine";
           
var ImageCombine = function () {};
ImageCombine.prototype = {
	combine : function(imageUrl1, imageUrl2, successCallback, errorCallback) {
		exec(successCallback,errorCallback,pluginNativeName,'combine',[imageUrl1, imageUrl2]);
	}
};
module.exports = new ImageCombine();



});
