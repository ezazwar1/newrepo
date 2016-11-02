/*global define, ionic, document, angular*/
define([
    'app',
    'services/browse',
    'services/user',
    'services/image',
    'services/message',
    'services/api',
    'factories/storage',
    'factories/popup',
    'directives/imageOnLoad'
], function (app) {

    'use strict';

    app.controller('BaseCtrl', [
        '$scope',
        '$rootScope',
        '$sce',
        '$q',
        '$window',
        '$timeout',
        '$ionicPopover',
        '$ionicHistory',
        'browseService',
        'userService',
        'imageService',
        'messageService',
        'apiService',
        'StorageFactory',
        'PopupFactory',
        'user',
        function ($scope, $rootScope, $sce, $q, $window, $timeout, $ionicPopover, $ionicHistory, browseService, userService, imageService, messageService, apiService, StorageFactory, popupFactory, user) {
            var avatarCopy,
                discoverVisited,
                feedVisited;

            $scope.trustAsHTML = $sce.trustAsHtml;

            if (user._id) {
                $scope.user = user;
                avatarCopy = angular.copy($scope.user.avatar);
                $scope.avatar = imageService.getPath(avatarCopy, 600);
                $scope.$broadcast('userLoaded');
            } else {
                $scope.$emit('clearLogin', true);
            }

            $scope.getAvatar = function () {
                return imageService.getPath(userService.user.avatar, 600);
            };

            $rootScope.$on('imageChanged', function () {
                $scope.avatar = $scope.getAvatar();
            });

            $scope.showIcon = false;

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                if (fromState.name.match(/^unauthorized/g)) {
                    $scope.$emit('appLoaded');
                }
                return;
            });

            $scope.$on('$stateChangeStart', function (event, toState) {
                if (!toState.noAuth && !userService.user._id) {
                    event.preventDefault();
                    $scope.$emit('clearLogin', true);
                } else if (toState.noAuth && userService.user._id) {
                    event.preventDefault();
                }
                return;
            });

            $scope.$on('messageCount', function () {
                $scope.getMessageCount();
            });

            function createPopOver() {
                $ionicPopover.fromTemplateUrl('popover.html', {
                    scope: $scope
                }).then(function (popover) {
                    $scope.menuPopOver = popover;
                });
            }
            createPopOver();

            $scope.openPopover = function ($event) {
                $scope.menuPopOver.show($event);
            };

            $scope.closePopover = function () {
                $scope.menuPopOver.hide().then(function () {
                    $scope.menuPopOver.remove().then(function () {
                        createPopOver();
                    });
                });
            };

            $scope.goToAndReset = function (stateName, type) {
                $scope.showIcon = '';
                $rootScope.resetHistory();
                $scope.goTo(stateName, type);
            };

            $scope.goTo = function (stateName, type) {
                feedVisited = StorageFactory.get('feedVisited');
                discoverVisited = StorageFactory.get('discoverVisited');

                if (!$rootScope.first) {
                    if (stateName === 'styleDiscover.detail' && (!discoverVisited && !feedVisited)) {
                        browseService.go('base.filterSettings', {first: 'discover'});
                        return;
                    }
                    if (!type && stateName !== 'profile.overview' && stateName !== 'editProfile') {
                        browseService.go('base.' + stateName);
                    } else if (stateName === 'profile.overview' || stateName === 'editProfile') {
                        browseService.go('base.' + stateName, {userId: userService.user._id});
                    } else {
                        browseService.go('base.' + stateName, {type: type});
                    }
                }
            };

            $scope.onPopoverClick = function (stateName, icon) {
                $rootScope.resetHistory();
                feedVisited = StorageFactory.get('feedVisited');
                discoverVisited = StorageFactory.get('discoverVisited');
                if (stateName === 'fashionFeed' && (!feedVisited && !discoverVisited)) {
                    $scope.showIcon = icon;
                    browseService.go('base.filterSettings', {first: 'feed'});
                    $scope.closePopover();
                    return;
                }
                $scope.showIcon = icon;
                $scope.goTo(stateName);
                $scope.closePopover();
            };

            $scope.back = function () {
                $ionicHistory.goBack();
            };

            $scope.getMessageCount = function () {
                messageService.getNew().then(function (res) {
                    $scope.newMessageCount = res.count;
                });
            };

            /*
             PUSHNOTIFICATIONS
             */
            function reRegisterAndroid(promise) {
                $window.plugins.pushNotification.register(
                    promise.resolve,
                    promise.resolve,
                    {
                        'senderID': apiService.config.pushNotification.gcm.project.toString(),
                        'ecb': 'onNotification'
                    }
                );
            }

            function reRegisterIOS(promise) {
                $window.plugins.pushNotification.register(
                    function (token) {
                        $rootScope.token = token;
                        promise.resolve();
                        $window.plugins.uniqueDeviceID.get(function (id) {
                            userService.token({
                                token: token,
                                platform: 'ios',
                                uuid: id
                            });
                        }, function () {
                            popupFactory({
                                title: $rootScope.dict.errorTitle,
                                template: $rootScope.dict.unknownError,
                                okType: 'button-clear button-light'
                            }, 'alert');
                        });
                    },
                    promise.resolve,
                    {
                        'alert': 'true',
                        'badge': 'true',
                        'ecb': 'onNotificationAPN'
                    }
                );
            }

            function registerPushNotifications() {
                var pushService,
                    q = $q.defer();
                if ($window.cordova && !$rootScope.token) {
                    pushService = $window.plugins.pushNotification;
                    if (ionic.Platform.isAndroid() && apiService.config && apiService.config.pushNotification && apiService.config.pushNotification.gcm && apiService.config.pushNotification.gcm.project) {
                        pushService.unregister(
                            function () {
                                reRegisterAndroid(q);
                            },
                            function () {
                                reRegisterAndroid(q);
                            }
                        );
                    } else if (ionic.Platform.isIOS()) {
                        pushService.unregister(
                            function () {
                                reRegisterIOS(q);
                            },
                            function () {
                                reRegisterIOS(q);
                            }
                        );
                    } else {
                        popupFactory({
                            title: $rootScope.dict.errorTitle,
                            template: $rootScope.dict.unknownError,
                            okType: 'button-clear button-light'
                        }, 'alert');
                    }
                } else {
                    q.resolve();
                }

                return q.promise;
            }

            // android reregister callback
            function androidLogin(event) {
                $window.plugins.uniqueDeviceID.get(function (id) {
                    // Define that the event name is 'build'.
                    // Create the event.
                    var readyEvent = document.createEvent('Event');
                    readyEvent.initEvent('appReady', true, true);
                    // target can be any Element or other EventTarget.
                    document.dispatchEvent(readyEvent);
                    userService.token({
                        token: event.regId,
                        platform: 'android',
                        uuid: id
                    });
                    $timeout(function () {
                        $rootScope.token = event.regId;
                    });
                    document.removeEventListener('androidLogin', androidLogin);
                }, function () {
                    popupFactory({
                        title: $rootScope.dict.errorTitle,
                        template: $rootScope.dict.unknownError,
                        okType: 'button-clear button-light'
                    }, 'alert');
                });
            }
            document.removeEventListener('androidLogin', androidLogin);
            document.addEventListener('androidLogin', androidLogin);


            function notificationReceived(e) {
                // e.target matches document from above
                // check if valid notification
                var pushNotification = angular.copy(e.notification);
                delete e.notification;
                if (pushNotification) {
                    // check if popup should shown (foreground)
                    if (pushNotification.isForeground) {
                        $scope.getMessageCount();
                    } else {
                        // aannnnnd redirect
                        $rootScope.resetHistory();
                        browseService.go('base.messages');
                        // check if there is badge flag
                        if (pushNotification.badge) {
                            // set badge
                            $window.plugins.pushNotification.setApplicationIconBadgeNumber(angular.noop, angular.noop, pushNotification.badge);
                        }
                    }
                }
            }

            // Listen for the event. -> push notification received
            document.removeEventListener('notificationReceived', notificationReceived);
            document.addEventListener('notificationReceived', notificationReceived, false);

            registerPushNotifications();
        }
    ]);
});
