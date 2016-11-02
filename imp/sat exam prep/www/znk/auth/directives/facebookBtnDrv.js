/**
 * facebook button directive - integration with firebase
 * */

(function (angular) {
    'use strict';

    angular.module('znk.sat').directive('facebookBtnDrv', ['FirebaseFacebookSrv', 'HintSrv', 'KeyboardSrv', '$state', 'OfflineContentSrv', 'ErrorHandlerSrv', 'NetworkSrv', '$timeout',
        function (FirebaseFacebookSrv, HintSrv, KeyboardSrv, $state, OfflineContentSrv, ErrorHandlerSrv, NetworkSrv, $timeout) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: 'znk/auth/templates/facebookBtnDrv.html',
                scope: {},
                link: function (scope) {

                    scope.disableClick = false;
                    scope.isOffline = NetworkSrv.isDeviceOffline();

                    function _startLoader() {
                        scope.disableClick = true;
                        scope.startLoader = true;
                        scope.fillLoader = undefined;
                    }

                    function _endLoader() {
                        scope.disableClick = false;
                        scope.startLoader = false;
                        scope.fillLoader = false;
                    }


                    /* authenticate with Redirect */
                    scope.authenticateRedirect = function() {
                        FirebaseFacebookSrv.authRedirect({ scope: "email"}).then(function() {
                             
                        }, function(error) {
                            ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.defaultErrorMessage + error);
                        });
                    };

                    scope.authenticatePlugin = function() {
                        if (scope.isOffline) {
                            ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                            return;
                        }

                        if(!scope.disableClick) {

                            _startLoader();

                            FirebaseFacebookSrv.facebookConnectViaPlugin({ scope: ["public_profile", "email", "user_friends"]}).then(function(data) {

                                FirebaseFacebookSrv.createUser({ access_token : data.authResponse.accessToken }).then(function(authData) {

                                    var finalData = angular.extend(data, {uid: authData.uid});

                                    afterAuth(finalData);

                                }, function(error) {
                                    _endLoader();
                                    
                                    ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                                });

                            }, function(error) {
                                _endLoader();
                                
                            });
                        }

                    };

                    function afterAuth(data) {

                        FirebaseFacebookSrv.get(data.uid).then(function(getData) {

                            if(angular.equals({}, getData)) {

                                var initUserProfile = {
                                    'email': data.email || '',
                                    'nickname': data.name || '',
                                    'provider': "facebook",
                                    'facebook' : data
                                };

                                FirebaseFacebookSrv.set(data, initUserProfile).then(function(res) {
                                    KeyboardSrv.hideKeyboard();
                                    $state.go('app.home');
                                    _endLoader();

                                }, function(error) {
                                    ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection + error);
                                });

                            } else {
                                OfflineContentSrv.checkForNewContent({silent: true}).then(function() {
                                    KeyboardSrv.hideKeyboard();
                                    $state.go ( 'app.home');
                                    _endLoader();
                                });
                            }

                        }, function(error) {
                            _endLoader();
                            ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection + error);
                        });
                    }

                    scope.$on('connectionChanged', function (event, isOffline) {
                        $timeout(function(){
                            scope.isOffline = isOffline;
                        });
                    });

                }
            };
        }
    ]);
})(angular);

