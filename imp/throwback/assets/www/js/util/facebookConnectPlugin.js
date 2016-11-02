/*
 * @author Ally Ogilvie
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2014
 * @file - facebookConnectPlugin.js
 * @about - JavaScript interface for PhoneGap bridge to Facebook Connect SDK
 *
 *
 */

 /*
  * Edits by Peter Kim (pkayfire) for Throwback
  *
  */

var FacebookConnectPlugin = angular.module('FacebookConnectPlugin', []);

FacebookConnectPlugin.run(function($window) {
    if (!$window.cordova) {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/en_US/sdk.js';
        e.async = true;
        document.getElementById('fb-root').appendChild(e);
    }
});

FacebookConnectPlugin.factory('facebook', function($window, $q) {

    var facebook = {};

    if ($window.cordova) {
        facebook.getLoginStatus = function (s, f) {
            cordova.exec(s, f, "FacebookConnectPlugin", "getLoginStatus", []);
        };

        facebook.showDialog = function (options, s, f) {
            cordova.exec(s, f, "FacebookConnectPlugin", "showDialog", [options]);
        };

        // Attach this to a UI element, this requires user interaction.
        facebook.login = function (permissions, s, f) {
            cordova.exec(s, f, "FacebookConnectPlugin", "login", permissions);
        };

        facebook.getAccessToken = function (s, f) {
            cordova.exec(s, f, "FacebookConnectPlugin", "getAccessToken", []);
        };

        facebook.logout = function (s, f) {
            cordova.exec(s, f, "FacebookConnectPlugin", "logout", []);
        };

        facebook.api = function (graphPath, permissions, httpMethod) {
            if (!httpMethod) {
                var httpMethod = 'GET';
            }

            var facebookAPIPromise = $q.defer();
            cordova.exec(function(result) {facebookAPIPromise.resolve(result)}, 
                         function(result) {facebookAPIPromise.reject(result)}, 
                         "FacebookConnectPlugin", 
                         "graphApi", 
                         [graphPath, permissions, httpMethod])  ;
            return facebookAPIPromise.promise;
        };

    } else {
        facebook.getLoginStatus = function (s, f) {
            // Try will catch errors when SDK has not been init
            try {
                FB.getLoginStatus(function (response) {
                    s(response.status);
                });
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        };

        facebook.showDialog = function (options, s, f) {
            
            if (!options.name) {
                options.name = "";
            }
            if (!options.caption) {
                options.caption = "";
            }
            if (!options.description) {
                options.description = "";
            }
            if (!options.link) {
                options.link = "";
            }
            if (!options.picture) {
                options.picture = "";
            }
            
            // Try will catch errors when SDK has not been init
            try {
                FB.ui({
                    method: options.method,
                    name: options.name,
                    caption: options.caption,
                    description: (
                        options.description
                    ),
                    link: options.link,
                    picture: options.picture
                },
                function (response) {
                    if (response && response.post_id) {
                        s({ post_id: response.post_id });
                    } else {
                        f(response);
                    }
                });
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        };
        // Attach this to a UI element, this requires user interaction.
        facebook.login = function (permissions, s, f) {
            // JS SDK takes an object here but the native SDKs use array.
            var permissionObj = {};
            if (permissions && permissions.length > 0) {
                permissionObj.scope = permissions.toString();
            }
            
            FB.login(function (response) {
                if (response.authResponse) {
                    s(response);
                } else {
                    f(response.status);
                }
            }, permissionObj);
        };

        facebook.getAccessToken = function (s, f) {
            var response = FB.getAccessToken();
            if (!response) {
                if (!f) {
                    console.error("NO_TOKEN");
                } else {
                    f("NO_TOKEN");
                }
            } else {
                s(response);
            }
        };

        facebook.logout = function (s, f) {
            // Try will catch errors when SDK has not been init
            try {
                FB.logout( function (response) {
                    s(response);
                })
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        };

        facebook.api = function (graphPath, permissions, httpMethod) {
            var facebookAPIPromise = $q.defer();

            if (!httpMethod) {
                var httpMethod = 'GET'
            }

            // JS API does not take additional permissions
            
            // Try will catch errors when SDK has not been init
            try {
                FB.api(graphPath, httpMethod, function (response) {
                    if (response.error) {
                        facebookAPIPromise.reject(response);
                    } else {
                        facebookAPIPromise.resolve(response);
                    }
                });
            } catch (error) {
                console.error(error.message);
                facebookAPIPromise.reject(error.message);
            }

            return facebookAPIPromise.promise;
        };

        // Browser wrapper API ONLY
        facebook.browserInit = function (appId, version) {
            if (!version) {
                version = "v1.0";
            }
            Parse.FacebookUtils.init({
                appId      : appId,
                xfbml      : true,
                version    : version
            });
        };
    }

    facebook.browserInit = function (appId, version) {
        if (!version) {
            version = "v1.0";
        }
        Parse.FacebookUtils.init({
            appId      : appId,
            xfbml      : true,
            version    : version
        });
    };

    return facebook;
});

