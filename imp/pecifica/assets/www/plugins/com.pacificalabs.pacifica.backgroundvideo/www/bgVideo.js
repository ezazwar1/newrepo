cordova.define("com.pacificalabs.pacifica.backgroundvideo.BGVideo", function(require, exports, module) {
var exec = require('cordova/exec');

var bgVideo = {
    play:function() {
        exec(null, null, "BGVideo", "play", []);
    },
    pause:function() {
        exec(null, null, "BGVideo", "pause", []);
    },
    setVideo:function(location, blurMethod) {
        var params = location ? [location] : [];

        if (blurMethod)
            params.push(blurMethod);

        exec(null, null, "BGVideo", "setVideo", params);
    },
    releaseAudio:function() {
        exec(null, null, "BGVideo", "releaseAudio", []);
    },
    playAudioInBackground:function() {
        exec(null, null, "BGVideo", "playAudioInBackground", []);
    },
    takeOverAudio:function() {
        exec(null, null, "BGVideo", "takeOverAudio", []);
    },
    getVideoDuration: function(successCallback, errorCallback) {
      cordova.exec(successCallback, errorCallback, "BGVideo", "getVideoDuration", []);
    },
    getVideoPosition: function(successCallback, errorCallback) {
      cordova.exec(successCallback, errorCallback, "BGVideo", "getVideoPosition", []);
    }
};

module.exports = bgVideo;
});
