/*global define, ionic, StatusBar, Connection, angular*/
define([
    'app',
    'services/browse',
    'services/image',
    'services/style',
    'services/user',
    'factories/storage',
    'factories/popup',
    'factories/storage'
], function (app) {

    'use strict';

    app.controller('AppCtrl', [
        '$scope',
        '$state',
        '$rootScope',
        '$window',
        '$timeout',
        '$ionicScrollDelegate',
        '$ionicPlatform',
        '$ionicHistory',
        '$document',
        'browseService',
        'userService',
        'PopupFactory',
        'StorageFactory',
        function ($scope, $state, $rootScope, $window, $timeout, $ionicScrollDelegate, $ionicPlatform, $ionicHistory, $document, browseService, userService, popupFactory, StorageFactory) {
            var popup,
                backButton;

            $rootScope.screen = {
                header: 45,
                footer: 60
            };

            $rootScope.sizes = {
                first: {},
                second: {},
                third: {},
                styleContainer: {},
                appInstruction: {}
            };

            if ($window.navigator.splashscreen) {
                $window.navigator.splashscreen.show();
            }

            ionic.Platform.ready(function () {
                if ($window.StatusBar) {
                    StatusBar.hide();
                    StatusBar.styleDefault();
                    StatusBar.overlaysWebView(true);
                }
            });

            function hideSplashScreen() {
                // hide splashscreen after own loading indicator is shown
                if ($window.navigator.splashscreen && ionic.Platform.isIOS()) {
                    $window.navigator.splashscreen.hide();
                }
            }

            $scope.$on('appLoaded', hideSplashScreen);
            // only to get sure the splashscreen is hidden
            $timeout(hideSplashScreen, 10000);

            // get screen resolution
            if (ionic.Platform.platform() === 'ios' && ionic.Platform.version() >= 8) {
                $rootScope.screen.height = $window.innerHeight;
                $rootScope.screen.width = $window.innerWidth;
            } else {
                $rootScope.screen.height = $window.outerHeight;
                $rootScope.screen.width = $window.outerWidth;
            }

            // calculate image sizes for the app instructions
            $rootScope.sizes.appInstruction.height = $rootScope.screen.height - 200;

            // calculate container sizes for styles
            if ($rootScope.screen.width < 768) {
                $rootScope.sizes.styleContainer.width = $rootScope.screen.width / 2;
            } else {
                $rootScope.sizes.styleContainer.width = $rootScope.screen.width / 4;
            }

            $rootScope.sizes.styleContainer.height = $rootScope.sizes.styleContainer.width * 1.5;

            // calculate sizes for start view and dashboard
            if ($rootScope.screen.width < ($rootScope.screen.height - $rootScope.screen.header) * (2 / 3)) {
                $rootScope.sizes.second.width = $rootScope.screen.width;
                $rootScope.sizes.second.height = $rootScope.screen.width;
            } else {
                $rootScope.sizes.second.width = $rootScope.screen.width;
                $rootScope.sizes.second.height = ($rootScope.screen.height - $rootScope.screen.header) * (2 / 3);
            }

            $rootScope.sizes.first.height = ($rootScope.screen.height - $rootScope.screen.header - $rootScope.sizes.second.height) / 2;
            $rootScope.sizes.third.height = $rootScope.sizes.first.height;

            $scope.getRestHeight = function (handle) {
                var delegateHandle;
                if (handle) {
                    delegateHandle = $ionicScrollDelegate.$getByHandle(handle);
                } else {
                    delegateHandle = $ionicScrollDelegate;
                }
                if (!handle) {
                    return '100%';
                }
                var scrollView = delegateHandle.getScrollView();

                if (!scrollView) {
                    return '100%';
                }

                return $rootScope.screen.height - scrollView.__container.getBoundingClientRect().top + 'px';
            };

            $scope.$on('$stateChangeSuccess', function () {
                // track in analytics
                if ($rootScope.gaConnected) {
                    $window.plugins.gaPlugin.trackPage(angular.noop, angular.noop, browseService.location());
                }
            });

            // check online
            if ($window.navigator.connection) {
                if ($window.navigator.connection.type === Connection.NONE) {
                    $rootScope.online = false;
                    popup = popupFactory({
                        title: $rootScope.dict.attention,
                        template: $rootScope.dict.connectionHint,
                        cssClass: 'no-connection-popup'
                    }, 'show');
                } else {
                    $rootScope.online = true;
                }
                document.addEventListener('online', function () {
                    if (!$rootScope.online) {
                        $rootScope.online = true;
                        $timeout(function () {
                            $rootScope.online = true;
                            if (popup) {
                                popup.close();
                            }
                            browseService.reload();
                        }, 0);
                    }
                }, false);
                document.addEventListener('offline', function () {
                    if ($rootScope.online) {
                        $timeout(function () {
                            $rootScope.online = false;
                            popup = popupFactory({
                                title: $rootScope.dict.attention,
                                template: $rootScope.dict.connectionHint,
                                cssClass: 'no-connection-popup'
                            }, 'show');
                        }, 0);
                    }
                }, false);
            } else {
                $rootScope.online = true;
            }

            $scope.$watch(function () {
                return $scope.online;
            }, function (online) {
                if (!online) {
                    backButton = $ionicPlatform.registerBackButtonAction(function (evt) {
                        evt.preventDefault();
                    }, 400);
                } else {
                    if (backButton) {
                        backButton();
                    }
                }
            });

            $ionicPlatform.registerBackButtonAction(function (evt) {
                if (browseService.current().name !== 'base.dashboard') {
                    $ionicHistory.goBack();
                } else {
                    evt.preventDefault();
                    popupFactory({
                        title: '<b>' + $rootScope.dict.closeApp + '</b>',
                        template: $rootScope.dict.closeAppHint,
                        buttons: [{
                            text: $rootScope.dict.no,
                            type: 'button button-outline button-dark',
                            onTap: function () {
                                return;
                            }
                        }, {
                            text: $rootScope.dict.yes,
                            type: 'button button-outline button-assertive',
                            onTap: function () {
                                ionic.Platform.exitApp(); // stops the app
                                return;
                            }
                        }]
                    });
                }
            }, 100);

            //override a href
            $document.on('click', function (e) {
                e = e || $window.event;
                var element = e.target || e.srcElement;
                //alert(element.tagName)
                if (element.tagName === 'DIV') {
                    return false;
                }

                if (element.tagName.toLowerCase() === 'a' && element.href && element.href !== '#') {
                    e.preventDefault();
                    // check if mail
                    if (element.href.indexOf('mailto:') !== -1) {
                        $window.open(element.href, '_system', 'location=yes,enableViewportScale=yes');
                        return false; // prevent default action and stop event propagation
                    }
                    // check if external link
                    if (element.href.match(/^(http|https|www)/)) {
                        $window.open(element.href, '_system', 'location=yes,enableViewportScale=yes');
                        return false; // prevent default action and stop event propagation
                    }
                }
            });

            $rootScope.resetHistory = function (notViewOptions) {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                if (!notViewOptions) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true,
                        expire: 0
                    });
                }
            };

            function clearLogin(loggedOut) {
                // clear possible intervals
                if ($rootScope.clearInterval) {
                    $rootScope.clearInterval();
                }

                $rootScope.resetHistory();
                // not already loggedOut
                if (!loggedOut) {
                    userService.logout().then(function () {
                        browseService.go('unauthorized.overview');
                    }, function () {
                        browseService.go('unauthorized.overview');
                    });
                } else {
                    StorageFactory.remove(StorageFactory.keys);
                    browseService.go('unauthorized.overview');
                }

                if ($window.navigator.splashscreen && ionic.Platform.isIOS()) {
                    $window.navigator.splashscreen.hide();
                }
            }

            $scope.$on('clearLogin', function (e, loggedout) {
                clearLogin(loggedout);
            });
        }
    ]);
});
