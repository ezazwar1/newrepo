cordova.define("com.nexercise.nativevideo.NativeVideo", function(require, exports, module) {
module.exports = {
    /**
     * Sets the path of the video player. After you call this, you need to call `play`.
     *
     * @param path string The path to the video to load.
     * @param successCallback function A function to call on success. Is passed the path you called with.
     * @param errorCallback function A function to call on error. It is passed an optional error object.
     */
    setPath: function (fileName, isUnlocked, deviceBasePath, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "NativeVideo", "ACTION_SET_PATH", [fileName, isUnlocked, deviceBasePath]);
    },

    /**
     * Plays the video.
     *
     * @param successCallback function A function to call on success.
     * @param errorCallback function A function to call on error. It is passed an optional error object.
     */
    play: function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "NativeVideo", "ACTION_PLAY", []);
    },

    /**
     * Pauses the video. Use this if you intend to resume the same video in the future.
     *
     * @param successCallback function A function to call on success.
     * @param errorCallback function A function to call on error. It is passed an optional error object.
     */
    pause: function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "NativeVideo", "ACTION_PAUSE", []);
    },

    /**
     * Stop the video. Use this if you do not intend to resume the same video in the future.
     *
     * @param successCallback function A function to call on success.
     * @param errorCallback function A function to call on error. It is passed an optional error object.
     */
    stop: function (successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "NativeVideo", "ACTION_STOP", []);
    },

    /**
     * Positions the video player on the screen. This should be called whenever you think the
     * player might need to move. You are able to call this before or after loading and playing
     * a video. Ideally it should be positioned before showing the video to the user to avoid
     * it jumping around.
     *
     * @param x integer The X position of the top left corner of the video.
     * @param y integer The Y position of the top left corner of the video.
     * @param width integer The width of the video.
     * @param height integer The height of the video.
     * @param successCallback function A function to call on success.
     * @param errorCallback function A function to call on error. It is passed an optional error object.
     */
    position: function (x, y, width, height, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "NativeVideo", "ACTION_POSITION", [x, y, width, height]);
    }

};

});
