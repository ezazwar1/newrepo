cordova.define("com.kahuna.phonegap.sdk.KahunaUserCredentials", function(require, exports, module) { module.exports = function KahunaUserCredentials() {
    var credentialsMap = {};

    return {
        addUserCredential : function(key, value) {
            if (!key || key == "" || !value || value == "") {
                console.error("You must have valid credentials to add to this object. Ignoring call.");
                return;
            }

            if (key in credentialsMap) {
                var valueArray = credentialsMap[key];
                if (!(value in valueArray)) {
                    valueArray.push(value); // Add this value to the array if it
                    // isn't there already.
                    credentialsMap[key] = valueArray;
                }
            } else {
                credentialsMap[key] = [ value ];
            }
        },
        getCredentialsMap : function() {
            return credentialsMap;
        },
        USERNAME_KEY : "username",
        EMAIL_KEY : "email",
        FACEBOOK_KEY : "fbid",
        TWITTER_KEY : "twtr",
        LINKEDIN_KEY : "lnk",
        USER_ID_KEY : "user_id",
        INSTALL_TOKEN_KEY : "install_token",
        GOOGLE_PLUS_ID : "gplus_id"
    }
};

});
