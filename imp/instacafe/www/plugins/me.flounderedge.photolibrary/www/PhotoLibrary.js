cordova.define("me.flounderedge.photolibrary.PhotoLibrary", function(require, exports, module) { var exec = require('cordova/exec');

var photoLibrary = {};

photoLibrary.saveImage = function(imageUrl, successCallback, failureCallback) {
    exec(successCallback, failureCallback, 'PhotoLibrary', 'saveImage', [imageUrl]);
}

module.exports = photoLibrary;

});
