angular.module('account.services', [])

    .service('AccountServ', function ($http, $q, $cordovaGeolocation, gbgConfig, $localstorage, $state, $ionicHistory) {

        this.fblogin = function (gamer) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'gamer_add',
                {
                    id: gamer.id,
                    access_token: gamer.access_token,
                    email: gamer.email,
                    first_name: gamer.first_name,
                    last_name: gamer.last_name,
                    name: gamer.name,
                    timezone: gamer.timezone,
                    locale: gamer.locale,
                    gender: gamer.gender,
                    verified: gamer.verified
                })
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('FB login: post error');
                });
            return deferred.promise;
        };

        this.register = function (email, name, password) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'register', {email: email, name: name, password: password})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('register: post error');
                });
            return deferred.promise;
        };

        this.login = function (email, password) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'login', {email: email, password: password})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('email login: post error');
                });
            return deferred.promise;
        };

        this.send_reset_email = function(email){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'forgot', {email: email})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject(data);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('reset: post error');
                });
            return deferred.promise;
        };

        this.logout = function () {
            $http.defaults.headers.common.gbgapikey = undefined;
            $localstorage.clearAll();
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $state.go('login');
        };

        this.post_location = function (lat, lon) {
            return $http
                .post(gbgConfig.api_url + 'gamer_location_update', {lat: lat, lon: lon})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        $localstorage.set('me_country', data.country);
                        $localstorage.set('me_currency_unit', data.currency_unit);
                    }
                    else {
                        console.log("location update: API return error");
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('location update: post error');
                });
        };

        this.start_location_tracking = function () {
            console.log('start location tracking');

            // begin a watch
            var options = {
                maximumAge: 0, //86400000, //accept a cached location for (ms) //24 hours
                timeout: 900000, // max time to pass the call (ms) //15 miniutes
                enableHighAccuracy: false //usually true === GPS, false === network
            };

            var self = this;
            var watch = $cordovaGeolocation.watchPosition(options);

            watch.then(
                null,
                function (error) {
                    console.log("Error while watching location");
                    console.log('code: ' + JSON.stringify(error));
                },
                function (position) {
                    var lat = position.coords.latitude
                    var lon = position.coords.longitude
                    console.log("Location is lat: " + lat + " lon: " + lon);
                    self.post_location(lat, lon);
                    console.log("After post, location is lat: " + lat + " lon: " + lon);
                }
            );
        };

        this.post_payment = function (token, amount) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'payment', {token: token, amount: amount})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            this.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('post payment: Api return error');
                    console.log(data);
                });
            return deferred.promise;
        };

        this.post_payment_sell = function (sell_credit, sell_credit_wallet, sell_credit_email) {
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'payment_sell', {sell_credit: sell_credit, sell_credit_wallet: sell_credit_wallet, sell_credit_email: sell_credit_email})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            this.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('post payment sell: Api return error');
                    console.log(data);
                });
            return deferred.promise;
        };

        this.notification_control_by_gamer = function(){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'notification_control_by_gamer')
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            this.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });

            return deferred.promise;
        };

        this.notification_control = function(deal_enable, match_enable, watch_enable, reminder_enable){
            var deferred = $q.defer();
            $http
                .post(gbgConfig.api_url + 'notification_control', {deal_enable: deal_enable, match_enable: match_enable, watch_enable: watch_enable, reminder_enable:reminder_enable})
                .success(function (data, status, headers, config) {
                    if (data.result === 'okay') {
                        deferred.resolve(data);
                    }
                    else {
                        if (data.error_code === 101 || data.error_code === 102) {
                            // api key error, should go to login page
                            this.logout();
                        }
                        else {
                            deferred.reject(data);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });

            return deferred.promise;
        };

    });