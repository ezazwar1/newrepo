
'use strict';
angular.module('stohke')
.factory('authService',
[
    '$http',
    '$q',
    '$rootScope',
    '$state',
    'Utils',
    'STOHKE_CONFIG',
    '$localStorage',
    '$timeout',
    function (
        $http,
        $q,
        $rootScope,
        $state,
        Utils,
        _STOHKE,
        $localStorage,
        $timeout
    ) {
        var serverBaseUrl = Utils.getServerBaseUrl();
        var _authentication = {
            isAuth: false,
            data: {}
        };

        var browser;
        var  getExternalLogins = function () {
            return $http.get(serverBaseUrl + '/api/account/externalLogins?returnUrl=%2F&generateState=true', {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
        };

        return {
            login: function (loginData) {
                console.log('attempt login', loginData);
                var me = this,
                    data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

                var deferred = $q.defer();

                $http.post(serverBaseUrl + '/token', data, 
                    {
                        headers: {
                        'Access-Control-Allow-Origin': '*'
                    }})
                    .success(function (response) {
                        console.log(response);
                        // localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
                        // console.log('authService login getUserInfo', response);
                        me.getUserInfo()
                            .then(function(data){
                                console.log(data.data);
                                if(data.data){
                                    _authentication.isAuth = true;
                                    _authentication.data = data.data;
                                    $rootScope.$broadcast('user:loggedIn');
                                    deferred.resolve(_authentication);
                                }else {
                                    deferred.reject();
                                }
                            }, function(reason){
                                deferred.reject(reason.data);
                            }
                        );

                    }).error(function (err, status) {
                        console.error(err, status);
                        // me.logOut();
                        deferred.reject(err);
                    });

                return deferred.promise;

            },
            logout: function (callback) {
                $http.post(serverBaseUrl +'/api/account/logout')
                    .then(
                        function(){
                            $localStorage.hasAuthenticated = false;
                            _authentication.isAuth = false;
                            _authentication.data = {};
                            $rootScope.$broadcast('user:loggedOut');
                            (callback || angular.noop)();
                        });
            },
            socialLogin: function (provider, inBG) {
                var me = this,
                    urlParams = 'location=no,';
                var loginDefer = $q.defer();
                if (inBG || $localStorage.hasAuthenticated) {
                    urlParams = 'hidden=yes';
                }
                getExternalLogins().then(
                    function (res) {
                        var providerData = null;
                        for (var i = 0; i < res.data.length; i++) {
                            if (provider === res.data[i].Name) {
                                providerData = res.data[i];
                                break;
                            }
                        }

                        if (providerData !== null) {
                            console.log('open auth browser using:', urlParams, '$ls.hasAuthenticated:' + $localStorage.hasAuthenticated, 'inBG:' + inBG);
                            browser = window.open(serverBaseUrl + providerData.Url, '_blank', urlParams);
                            // In case browser fails. fall back to normal browser
                            if (!browser) {
                                browser = window.open(serverBaseUrl + providerData.Url, '_blank', 'location=no');
                            }
                            // Watch Url for stohke.com
                            browser.addEventListener('loadstart', function (event) {
                                console.log('onLoadStart = ', event);
                                // Hack to detect facebook forward to Stohke main site.
                                if (event.url.indexOf('stohke.com/#') > 0) {
                                    // Safe to assume we made it back;
                                    // console.log('closing IAB');
                                    browser.close();
                                    $timeout(function(){
                                        loginDefer.resolve();
                                    }, 500);
                                }
                            });
                            // browser.addEventListener('loadstop', myCallback);
                            browser.addEventListener('loaderror', function () {
                                console.error('FB login loaderror');
                                if (inBG) {
                                    browser.close();
                                    browser = null;
                                    console.log('try again without hiding');
                                    me.socialLogin(provider);
                                    return false;
                                }
                                loginDefer.reject();
                                return false;
                            });
                            //  auto timeout after 5 seconds when opened in bg
                            if (inBG || $localStorage.hasAuthenticated) {
                                browser.addEventListener('loadstop', function () {
                                    console.log('onloadStop', browser);
                                    $timeout( function () {
                                        console.log('onloadstop timeout called...');
                                        browser.close();
                                    }, 10 * 1000);
                                });
                            }
                        }
                    },
                    function (error) {
                        if (browser) {
                            browser.close();
                        }
                        console.log(error);
                        return false;
                    }
                );
                $q.when(loginDefer.promise).then(function () {
                    $localStorage.hasAuthenticated = true;
                    console.log('get user info after login');
                    $timeout(function () {
                        if (browser) {
                            browser.close();
                        }
                        me.checkAuth();
                    }, 800);
                });
                return loginDefer.promise;
            },
            getUserInfo: function () {
                return $http.get(serverBaseUrl + '/api/account/DisplayName', {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    transformResponse: function (data) {
                        if (typeof (data) == 'string') {
                            data = JSON.parse(data);
                        }
                        if ($localStorage.profileImageLastUpdated) {
                            data.UrlPic += '?' + $localStorage.profileImageLastUpdated;
                        }
                        return data;
                    }
                });
            },
            checkAuth: function () {
                var deferred = $q.defer();
                this.getUserInfo().success(function (res) {
                    console.log(res);
                    if (res.UrlPic === '/Content/Images/tail-body.gif') {
                        res.UrlPic = _STOHKE.defaultImg;
                    }
                    if (res) {
                        _authentication.data = res;
                        _authentication.isAuth = true;
                    }
                        $rootScope.$broadcast('user:loggedIn', _authentication);

                    deferred.resolve(_authentication);
                })
                .error(function () {
                    _authentication.data = {};
                    _authentication.isAuth = false;
                    deferred.resolve(_authentication);
                });
                return deferred.promise;
            },
            authentication: function () {
                var q = $q.defer();
                if (!_authentication.isAuth) {
                    this.checkAuth().then(function (data) {
                        $rootScope.$broadcast('user:loggedIn', data);
                        q.resolve(data);
                    }, function () {
                        q.reject(_authentication);
                    });
                } else {
                    q.resolve(_authentication);
                }

                return q.promise;
            },
            _authentication: function () {
                return _authentication;
            }
        };
    }
]);
