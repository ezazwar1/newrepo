cordova.define("com.kahuna.phonegap.sdk.KahunaEventBuilder", function(require, exports, module) { module.exports = function KahunaEventBuilder(eventName) {
    this.eventName = eventName;
    this.properties = {};
    this.count = -1;
    this.value = -1;

    this.setPurchaseData = function(count, value) {
        this.count = count;
        this.value = value;
    };

    this.addProperty = function(key, value) {
        if(key && value && typeof key === "string" && typeof value === "string" && key.length > 0 && value.length > 0) {
            if(key.trim().toLowerCase().indexOf('k_') == 0) {
                Console.log("[Kahuna] Warning: key starts with k_ is considered reserved keys.");
            } else {
                var keyInProperties = this.properties[key] || {};

                // to ensure Event Property's keys are unique, it's put in to a hash
                // it will then be converted to an Array before the event is sent to Kahuna
                keyInProperties[value] = true;
                this.properties[key] = keyInProperties;
            }
        }
    };

    this.build = function() {
        var kahunaEvent = new KahunaEvent();
        kahunaEvent.count = this.count;
        kahunaEvent.value = this.value;
        kahunaEvent.eventName = this.eventName;
        kahunaEvent.properties = this.properties;
        return kahunaEvent;
    }
};
});
