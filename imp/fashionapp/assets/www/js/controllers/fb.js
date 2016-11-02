myApp
.controller('FbCtrl', function($scope, $http, $ionicPlatform, $timeout, $ionicSlideBoxDelegate, Storage) {

        var fbLoginSuccess = function (userData) {

            if (ionic.Platform.isIOS()) {

                console.log('ios');

                $http({method: 'GET', url: 'https://graph.facebook.com/v2.0/me?fields=picture%2Cfirst_name%2Clast_name%2Cemail&method=GET&format=json&suppress_http_code=1&access_token=' + userData.authResponse.accessToken
                }).
                success(function(data, status, headers, config) {

                    var firstName  = data.first_name;
                    var lastName   = data.last_name;
                    var facebookId = data.id;
                    var picture    = data.picture.data.url;
                    var email      = data.email;

                    alert(firstName);
                    alert(lastName);
                    alert(facebookId);
                    alert(picture);
                    alert(email);

                }).
                error(function(data, status, headers, config) {
                    alert(JSON.stringify(data));
                });

            } else if (ionic.Platform.isAndroid()){

                console.log('android');

                facebookConnectPlugin.getAccessToken(function(token) {

                    $http({method: 'GET', url: 'https://graph.facebook.com/v2.0/me?fields=picture%2Cfirst_name%2Clast_name%2Cemail&method=GET&format=json&suppress_http_code=1&access_token=' + token
                    }).
                    success(function(data, status, headers, config) {

                        var firstName  = data.first_name;
                        var lastName   = data.last_name;
                        var facebookId = data.id;
                        var picture    = data.picture.data.url;
                        var email      = data.email;

                        alert(firstName);
                        alert(lastName);
                        alert(facebookId);
                        alert(picture);
                        alert(email);

                        // call register or just log him

                    }).
                    error(function(data, status, headers, config) {

                    });

                    }, function(err) {
                        alert("Could not get access token: " + err);
                    });
            }
        };

        $scope.callFb = function(){

            facebookConnectPlugin.login(["email"],
                fbLoginSuccess,
                function (error) {
                    alert('Connexion à Facebook impossible');
                }
            );
        };
});
