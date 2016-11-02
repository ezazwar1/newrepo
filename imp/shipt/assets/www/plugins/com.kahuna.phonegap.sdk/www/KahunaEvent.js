cordova.define("com.kahuna.phonegap.sdk.KahunaEvent", function(require, exports, module) { module.exports = function KahunaEvent() {
    var EVENT_PROPERTIES_MAX_COUNT = 25;
    this.eventName;
    this.properties = {};
    this.count = -1;
    this.value = -1;

    this.getPropertiesAsMap = function() {
        if (null != this.properties  && Object.keys(this.properties).length > 0) {
            var copy = {};
            for (var key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    copy[key] = Object.keys(this.properties[key]);
                    if (Object.keys(copy).length === EVENT_PROPERTIES_MAX_COUNT) {
                        break;
                    }
                }
            }
            return copy;
        }
    };
};

});
