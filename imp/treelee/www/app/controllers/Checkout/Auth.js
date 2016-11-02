/*global define, google, navigator*/
define([
    'app',
    'services/user',
    'services/checkout',
    'services/browse',
    'factories/loading',
    'factories/popup'
], function (app) {

    'use strict';

    app.controller('AuthCtrl', [
        '$ionicNavBarDelegate',
        '$scope',
        '$rootScope',
        '$timeout',
        '$ionicScrollDelegate',
        'userService',
        'checkoutService',
        'cartService',
        'browseService',
        'LoadingFactory',
        'PopupFactory',
        function ($ionicNavBarDelegate, $scope, $rootScope, $timeout, $ionicScrollDelegate, userService, checkoutService, cartService, browseService, LoadingFactory, PopupFactory) {

            var recoverFinished = true,
                loading = new LoadingFactory();

            $scope.auth = {
                method: '',
                email: '',
                password: ''
            };

            $scope.pending = false;

            $scope.recover = {};
            $scope.register = {};
            $scope.form = {};

            $scope.goBack = function () {
                $ionicNavBarDelegate.back();
            };

            $scope.recoverPassword = function () {
                $scope.pending = true;
                var loading = new LoadingFactory();
                loading.then(function (loadingOverlay) {
                    userService.recoverPassword($scope.recover).then(function () {
                        recoverFinished = true;
                        $scope.recoverInfo = {
                            'class': 'balanced',
                            'msg': $rootScope.dict.success.new_password_sent
                        };
                        $scope.recover = {};
                        loadingOverlay.hide();
                        $scope.pending = false;
                    }, function () {
                        $scope.recoverInfo = {
                            'class': 'assertive',
                            'msg': $rootScope.dict.error.email_wasnt_found
                        };
                        loadingOverlay.hide();
                        $scope.pending = false;
                    });
                });
            };


            loading.then(function (loadingOverlay) {
                userService.loggedIn().then(function (loggedIn) {
                    if (loggedIn) {
                        loadingOverlay.hide();
                        $scope.loggedIn = true;
                    } else {
                        userService.getRegisterForm().then(function (formFields) {
                            $scope.registerFields = formFields;
                            loadingOverlay.hide();
                        }, function () {
                            loadingOverlay.hide();
                            $scope.noRegister = true;
                        });
                    }
                }, loadingOverlay.hide);
            });

            $scope.$watch('auth.method', function () {
                $ionicScrollDelegate.resize();
            });

            $scope.recoverModal = function () {
                recoverFinished = false;
                var popup = new PopupFactory({
                    title: $rootScope.dict.recoverPassword,
                    subTitle: $rootScope.dict.enterEmail,
                    template: '<p ng-if="recoverInfo" ng-class="recoverInfo.class">{{recoverInfo.msg}}</p><form name="form.recoverForm" ng-submit="form.recoverForm.$valid && !pending && recoverPassword()"><label class="item item-input"><input type="email" ng-model="recover.email" placeholder="{{dict.emailPlaceholder}}" required></label></form>',
                    scope: $scope,
                    buttons: [{
                        text: $rootScope.dict.back,
                        onTap: function () {
                            $scope.recoverInfo = undefined;
                        }
                    }, {
                        text: $rootScope.dict.recover,
                        type: 'button-energized',
                        onTap: function (e) {
                            e.preventDefault();
                            if ($scope.form.recoverForm && $scope.form.recoverForm.$valid && !$scope.pending) {
                                $scope.recoverPassword();
                            }
                        }
                    }]
                });
                $scope.$watch(function () {
                    return recoverFinished;
                }, function (finished) {
                    if (finished && popup) {
                        $timeout(function () {
                            popup.close();
                            $scope.recoverInfo = undefined;
                        }, 2000);
                    }
                });
            };

            $scope.login = function () {
                var params,
                    loading,
                    oldCart;

                if ($scope.auth.method === 'login') {
                    params = {
                        username: $scope.auth.email,
                        password: $scope.auth.password
                    };
                    loading = new LoadingFactory();

                    loading.then(function (loadingOverlay) {
                        cartService.getInfo().then(function (cart) {
                            oldCart = cart.summary_qty;
                            userService.login(params).then(function () {
                                userService.getUserAddress().then(function () {
                                    checkoutService.prefillSaved(userService.address);
                                    cartService.getInfo().then(function (newCart) {
                                        loadingOverlay.hide();
                                        //check if old cart of user exists
                                        if (newCart.summary_qty === oldCart) {
                                            browseService.navigate('/checkout/billing', true);
                                        } else {
                                            browseService.navigate('/checkout/cart', true);
                                        }
                                    });
                                }, function () {
                                    loadingOverlay.hide();
                                    browseService.navigate('/checkout/billing', true);
                                });
                            }, function () {
                                loadingOverlay.hide();
                                $scope.loginInfo = {
                                    'class': 'assertive',
                                    'msg': $rootScope.dict.error.invalid_login_or_password
                                };
                            });
                        });
                    });
                }
            };

            $scope.alreadyLoggedIn = function () {
                if ($scope.auth.method === '' && $scope.loggedIn) {
                    loading = new LoadingFactory();

                    loading.then(function (loadingOverlay) {
                        userService.getUserAddress().then(function () {
                            checkoutService.prefillSaved(userService.address);
                            loadingOverlay.hide();
                            browseService.navigate('/checkout/billing', true);
                        }, function () {
                            loadingOverlay.hide();
                            browseService.navigate('/checkout/billing', true);
                        });
                    });
                }
            };

            $scope.registerUser = function () {
                var loading;

                if ($scope.auth.method === 'register') {
                    loading = new LoadingFactory();

                    loading.then(function (loadingOverlay) {
                        checkoutService.method('register').then(function () {
                            checkoutService.prefillRegistered($scope.register);
                            userService.register($scope.register).then(function () {
                                loadingOverlay.hide();
                                browseService.navigate('/checkout/billing', true);
                            }, function (error) {
                                loadingOverlay.hide();
                                if (error.text) {
                                    if ($rootScope.dict.error[error.text]) {
                                        $scope.registerInfo = {
                                            'class': 'assertive',
                                            'msg': $rootScope.dict.error[error.text]
                                        };
                                    } else {
                                        $scope.registerInfo = {
                                            'class': 'assertive',
                                            'msg': error.text
                                        };
                                    }
                                } else {
                                    $scope.registerInfo = {
                                        'class': 'assertive',
                                        'msg': $rootScope.dict.error.defaultText
                                    };
                                }
                            });
                        }, function () {
                            loadingOverlay.hide();
                            $scope.registerInfo = {
                                'class': 'assertive',
                                'msg': $rootScope.dict.error.defaultText
                            };
                        });
                    });
                }
            };

            $scope.logout = function () {
                var loading;

                loading = new LoadingFactory();

                loading.then(function (loadingOverlay) {
                    userService.logout().then(function () {
                        loadingOverlay.hide();
                        browseService.reload();
                    }, function (error) {
                        loadingOverlay.hide();
                        $scope.logoutInfo = {
                            'class': 'assertive',
                            'msg': error.text
                        };
                    });
                });
            };

            $scope.next = function () {
                var loading;

                if ($scope.auth.method === 'guest') {
                    loading = new LoadingFactory();

                    loading.then(function (loadingOverlay) {
                        checkoutService.method('guest').then(function () {
                            browseService.navigate('/checkout/billing', true);
                            loadingOverlay.hide();
                        }, function (error) {
                            loadingOverlay.hide();
                            $scope.info = {
                                type: 'error',
                                message: error.text
                            };
                        });
                    });
                } else if ($scope.auth.method === '' && $scope.loggedIn) {
                    $scope.alreadyLoggedIn();
                }

                $scope.setSubmit();
            };

            $scope.setSubmit = function () {
                $scope.submitted = true;
            };
        }
    ]);
});
