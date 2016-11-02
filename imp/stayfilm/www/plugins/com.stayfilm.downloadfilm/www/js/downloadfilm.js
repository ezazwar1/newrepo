cordova.define("com.stayfilm.downloadfilm.downloadfilm", function(require, exports, module) {
window.downloadMovieToDevice = function(obj, callback) {
    cordova.exec(
                 function success(params) {
                 callback(null, params);
                 },
                 function error(err) {
                 callback(err);
                 },
                 "DownloadToDevice", "downloadMovieToDevice", [obj.idmovie, obj.url, obj.title]
                 );
};

window.shareViaWhatsApp = function(obj, callback) {
    cordova.exec(
                 function success(params) {
                 callback(null, params);
                 },
                 function error(err) {
                 callback(err);
                 },
                 "DownloadToDevice", "shareViaWhatsApp", [obj.idmovie, obj.url, obj.title]
                 );
};

window.shareViaInstagram = function(obj, callback) {
    cordova.exec(
                 function success(params) {
                 callback(null, params);
                 },
                 function error(err) {
                 callback(err);
                 },
                 "DownloadToDevice", "shareViaInstagram", [obj.idmovie, obj.url, obj.title]
                 );
};

window.checkDownloadProgress = function(obj, callback) {
    cordova.exec(
                 function success(params) {
                 callback(null, params);
                 },
                 function error(err) {
                 callback(err);
                 },
                 "DownloadToDevice", "checkDownloadProgress", [obj.idmovie]
                 );
};
});
